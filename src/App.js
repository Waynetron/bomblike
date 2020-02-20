import React, { useState } from 'react';
import Map from './Map';
import { getEntitiesAt } from './map/map-util';
import { makeEmptyRoom } from './map/map-generation';
import { walkInALine, faceWalkable, attackAdjacentPlayer } from './behaviours';
import { makeEntity } from './entities';
import './App.css';

const initialPlayer = makeEntity({
  char: '@',
  position: {x: 1, y: 1},
  solid: true,
});
const playerId = initialPlayer.id;

const generateLevel = (player) => {
  const emptyRoom = makeEmptyRoom();
  const enemy = makeEntity({
    char: 'G',
    position: {x: 9, y: 9},
    solid: true,
    facing: {x: 0, y: -1},
    behaviours: [walkInALine, faceWalkable, attackAdjacentPlayer],
    actions: [{type: 'move', direction: {x: 0, y: -1}}]
  });

  return {
      ...emptyRoom,
      [initialPlayer.id]: initialPlayer,
      [enemy.id]: enemy
  };
}

function App() {
  const [entities, setEntities] = useState(generateLevel(initialPlayer));

  const nextLevel = (player) => {

  }

  const move = (entity, direction) => {
    const newPosition = {
      x: entity.position.x + direction.x,
      y: entity.position.y + direction.y
    }

    // Check if anything is in the way
    const upcomingEntities = getEntitiesAt(newPosition, entities);
    if (Object.values(upcomingEntities).filter(upcoming => upcoming.solid).length > 0) {
      return;
    }

    entity.position = newPosition
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

  const performTurn = () => {
    // Add any actions generated from behaviours
    for (const entity of Object.values(entities)) {
      for (const behaviour of entity.behaviours) {
        const actions = behaviour(entity, entities);
        entity.actions.push(...actions);
      }
    }

    // Perform actions
    for (const entity of Object.values(entities)) {
      for (const action of entity.actions) {
        if (action.type === 'move') {
          console.log('move');
          move(entity, action.direction);
        }
        if (action.type === 'face') {
          entity.facing = action.direction;
        }
        if (action.type === 'attack') {
          const { value, target } = action;
          target.health -= value;
          window.location.reload();
        }
      }
    }


    // Kill any entities with no health
    for (const entity of Object.values(entities)) {
      if (entity.health <= 0) {
        entity.alive = false;
      }
    }
    const remainingEntities = Object.values(entities).filter(entity => entity.alive);

    // Clear actions
    for (const entity of Object.values(remainingEntities)) {
      entity.actions = [];
    }

    setEntities({...remainingEntities});
  }
  
  const handleKeyDown = ({key}) => {
    const direction = keyToDirection(key);
    const wait = key === 'Space';

    if (direction) {
      entities[playerId].actions.push({type: 'move', direction})
    }

    if (direction || wait) {
      performTurn();
    }
  }
  
  return (
    <div className="app" tabIndex={0} onKeyDown={handleKeyDown} autofocus="true">
      <Map entities={entities} />
    </div>
  );
}

export default App;
