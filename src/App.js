import React, { useState } from 'react';
import styled from 'styled-components'
import Map from './Map';
import { generateLevel } from './map/map-generation';
import { getEntitiesAt } from './map/map-util';
import { subtract } from './math';
import { player } from './entities';
import './App.css';

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
const MenuContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

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

  animation-name: 'shake';
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(.36,.07,.19,.97);
`

const findPlayer = entities => Object.values(entities).find(entity => entity.char === '@');

function App() {
  const [entities, setEntities] = useState(generateLevel(player()));
  const [level, setLevel] = useState(0);
  const [events, setEvents] = useState({});

  const startGame = () => {
    setLevel(1);
    setEntities(generateLevel(player()));
  }

  const nextLevel = (player) => {
    setLevel(level + 1);
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
    const player = findPlayer(entities);

    if (direction) {
      player.actions.push({type: 'move', direction, cost: 1})
    }

    if (direction || wait) {
      const newEvents = {};

      // Do players turn first
      performTurn(player, entities, newEvents);

      // Then everything else
      const everythingElse = Object.values(entities).filter(entity => entity.id !== player.id);
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
        nextLevel(player);
      }
    }

    if (restart) {
      window.location.reload();
    }
  }
  
  if (!findPlayer(entities)) {
    return (
      <div><button onClick={startGame}>Start game</button></div>
    )
  }
  if (level === 0) {
    return (
      <MenuContainer shake={events.shake === true} tabIndex={0}>
        <h1>reactlike</h1>
        <button onClick={startGame}>play</button>
      </MenuContainer>
    )
  }
  if (level === 3) {
    return (
      <MenuContainer shake={events.shake === true} tabIndex={0}>
        <h1>Success!</h1>
        <button onClick={startGame}>Play again</button>
      </MenuContainer>
    )
  }
  return (
    <AppContainer className={'app-container'} shake={events.shake === true} tabIndex={0} onKeyDown={handleKeyDown} autofocus="true">
      <Map entities={entities} />
    </AppContainer>
  );
}

export default App;
