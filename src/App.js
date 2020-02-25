import React, { useState } from 'react';
import styled from 'styled-components'
import Map from './Map';
import { getEntitiesAt } from './map/map-util';
import { makeEmptyRoom } from './map/map-generation';
import { subtract } from './math';
import { walkInALine, faceWalkable, attackAdjacentPlayerAndDie } from './behaviours';
import { makeEntity } from './entities';
import './App.css';

const initialPlayer = makeEntity({
  char: '@',
  position: {x: 1, y: 1},
  solid: true,
  health: 3,
});
const playerId = initialPlayer.id;

const generateLevel = (player) => {
  const emptyRoom = makeEmptyRoom();
  const enemy = makeEntity({
    char: 'G',
    position: {x: 9, y: 9},
    solid: true,
    behaviours: [walkInALine, faceWalkable, attackAdjacentPlayerAndDie],
    actions: [{type: 'move', direction: {x: 0, y: -1}}]
  });

  return {
      ...emptyRoom,
      [initialPlayer.id]: initialPlayer,
      [enemy.id]: enemy
  };
}

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @keyframes shake {
    0% {
      background-color: crimson;
    }
    20% {
      transform: translate3d(${Math.random() * 2 + 2}px, ${Math.random() * -2 - 2}px, 0);
      background-color: crimson;
    } 
    40% {
      transform: translate3d(${Math.random() * -2 - 2}px, ${Math.random() * 2 + 2}px, 0);
    }
    60% {
      transform: translate3d(${Math.random() * 2 + 2}px, ${Math.random() * 2 + 2}px, 0);
    }
    80% {
      transform: translate3d(${Math.random() * -2 - 2}px, ${Math.random() * -2 - 2}px, 0);
    }
  }

  animation-name: ${props => props.shake ? 'shake' : undefined};
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(.36,.07,.19,.97);
`

function App() {
  const [entities, setEntities] = useState(generateLevel(initialPlayer));
  const [events, setSideEffects] = useState(generateLevel(initialPlayer));

  const move = (entity, direction) => {
    const newPosition = {
      x: entity.position.x + direction.x,
      y: entity.position.y + direction.y
    }

    // Check if anything is in the way
    const upcomingEntities = getEntitiesAt(newPosition, entities);
    if (Object.values(upcomingEntities).filter(upcoming => upcoming.solid).length > 0) {
      return false;
    }

    entity.position = newPosition
    return true;
  }

  const keyToDirection = (key) => {
    const mapping = {
      ArrowUp: {x: 0, y: -1},
      ArrowDown: {x: 0, y: 1},
      ArrowLeft: {x: -1, y: 0},
      ArrowRight: {x: 1, y: 0}
    }

    return mapping[key];
  }

  const performActions = (entity, events) => {
    let actionPoints = entity.actionsPerTurn;
      while(entity.actions.length > 0) {
        const action = entity.actions.pop();
        
        if (actionPoints >= action.cost) {
          actionPoints -= action.cost
        } else {
          continue;
        }


        if (action.type === 'wait') {
          entity.status['waiting'] = true;
        }
        if (action.type === 'attack') {
          const { value, target } = action;
          target.health -= value;
          entity.status['attacking'] = subtract(target.position, entity.position);
          events.shake = true;
        }
        if (action.type === 'move') {
          if (move(entity, action.direction)) {
            entity.status['moving'] = true;
          }
          else {
          }
        }
        if (action.type === 'face') {
          entity.facing = action.direction;
          // no action cost
        }
      }
  }

  const performTurn = (id, entities) => {
    const events = {};
    const entity = entities[id];

    // Reset status
    entity.status = {};

    // Add any actions generated from behaviours
    for (const behaviour of entity.behaviours) {
      const actions = behaviour(entity, entities).reverse();
      entity.actions.push(...actions);
    }

    // Perform actions
    performActions(entity, events);


    // Kill if no health
    if (entity.health <= 0) {
      entity.alive = false;
    }

    // Clear actions
    entity.actions = [];

    // Remove if not alive anymore
    const remainingEntities = Object.values(entities).filter(entity => entity.alive);

    // Update everything
    setEntities({...remainingEntities});
    setSideEffects(events);
  }
  
  const handleKeyDown = ({key}) => {
    const direction = keyToDirection(key);
    const wait = key === ' ';
    const restart = key === 'r'

    if (direction) {
      entities[playerId].actions.push({type: 'move', direction, cost: 1})
    }

    if (direction || wait) {
      // Do players turn first
      performTurn(playerId, entities);

      // Then everything else
      const everythingElse = Object.values(entities).filter(entity => entity.id !== playerId);
      for (const entity of everythingElse) {
        performTurn(entity.id, entities);
      }
    }

    if (restart) {
      window.location.reload();
    }
  }
  
  return (
    <AppContainer shake={events.shake === true} className="app" tabIndex={0} onKeyDown={handleKeyDown} autofocus="true">
      <Map entities={entities} />
    </AppContainer>
  );
}

export default App;
