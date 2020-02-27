import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import Map from './Map';
import { generateLevel } from './map/map-generation';
import { getEntitiesAt } from './map/map-util';
import { subtract } from './math';
import { makeEntity } from './entities';
import './App.css';
import { traverseStairs } from './behaviours';

const initialPlayer = makeEntity({
  char: '@',
  position: {x: 1, y: 1},
  solid: true,
  health: 3,
  behaviours: [traverseStairs],
});
const playerId = initialPlayer.id;

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
  const [level, setLevel] = useState(0);
  const [events, setEvents] = useState({});

  const nextLevel = () => {
    console.log('next level');
    setLevel(level + 1);
    const player = entities[playerId];
    const nextLevel = generateLevel(player);
    setEntities(nextLevel);
  }

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

  const performActions = (entity, newEvents) => {
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
          newEvents.shake = true;
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
        }
        if (action.type === 'change-level') {
          newEvents.changeLevel = true;
        }
      }
  }

  const performTurn = (entity, entities, newEvents) => {
    // Reset status
    entity.status = {};

    // Add any actions generated from behaviours
    for (const behaviour of entity.behaviours) {
      const actions = behaviour(entity, entities).reverse();
      entity.actions.push(...actions);
    }

    // **IMPORTANT** Perform actions does a lot of sneaky mutation
    // May mutate any entity (either the supplied entity, but also any entity referenced in an action)
    // May push events into newEvents
    performActions(entity, newEvents);

    // Clear actions
    entity.actions = [];
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
  
  const handleKeyDown = ({key}) => {
    const direction = keyToDirection(key);
    const wait = key === ' ';
    const restart = key === 'r'

    if (direction) {
      entities[playerId].actions.push({type: 'move', direction, cost: 1})
    }

    if (direction || wait) {
      const newEvents = {};

      // Do players turn first
      performTurn(entities[playerId], entities, newEvents);

      // Then everything else
      const everythingElse = Object.values(entities).filter(entity => entity.id !== playerId);
      for (const entity of everythingElse) {
        performTurn(entity, entities, newEvents);
      }

      // Remove anything with 0 health
      const livingEntities = Object.values(entities).filter(entity => entity.health > 0);

      // Update state
      setEntities({...livingEntities});
      setEvents(newEvents);

      // Apply certain events now
      // Others like screenshake will react to props change after setEvents is called
      if (newEvents.changeLevel) {
        nextLevel();
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
