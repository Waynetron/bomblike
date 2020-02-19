import React, { useState } from 'react';
import Map from './Map';
import { getEntitiesAt } from './map/map-util';
import { makeEmptyRoom } from './map/map-generation';
import { walkInALine, faceAwayFromSolid } from './behaviours';
import { makeEntity } from './entities';
import './App.css';

const initialPlayer = makeEntity({x: 1, y: 1}, '@', {solid: true});
const playerId = initialPlayer.id;

const generateLevel = (player) => {
  const emptyRoom = makeEmptyRoom();
  const enemy = makeEntity(
    {x: 9, y: 9},
    'G',
    {
      solid: true,
      facing: {x: 0, y: -1},
      behaviours: [walkInALine, faceAwayFromSolid],
      actions: [{type: 'move', direction: {x: 0, y: -1}, lifespan: 3}]
    }
  );

  return {
      ...emptyRoom,
      [initialPlayer.id]: initialPlayer,
      [enemy.id]: enemy
  };
}

function App() {
  const [entities, setEntities] = useState(generateLevel(initialPlayer));

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


    const newEntity = {...entity};
    newEntity.position = newPosition

    entities[entity.id] = newEntity;
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
    // Perform actions
    for (const entity of Object.values(entities)) {
      for (const action of entity.actions) {
        if (action.type === 'move') {
          move(entity, action.direction);
        }
      }
    }

    // Clear actions
    for (const entity of Object.values(entities)) {
      // Reduce action lifespan
      entity.actions.map(action => {
        if (action.lifespan > 0) {
          action.lifespan -= 1
        };
        return action;
      })

      // Remove actions that have exactly 0 lifespan (-1 will live forever)
      entity.actions = entity.actions.filter(action => action.lifespan !== 0);
    }

    setEntities({...entities});
  }
  
  const handleKeyDown = ({key}) => {
    const direction = keyToDirection(key);
    const wait = key === 'Space';

    if (direction) {
      entities[playerId].actions.push({type: 'move', direction, lifespan: 1})
    }

    if (direction || wait) {
      performTurn();
    }
  }
  
  return (
    <div className="app" tabIndex={0} onKeyDown={handleKeyDown}>
      <Map entities={entities} />
    </div>
  );
}

export default App;
