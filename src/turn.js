import { findPlayer, bomb } from './entity/entities';
import { getEntitiesAt } from './map/map-util';
import { subtract } from './math';

export const move = (entity, entities, direction) => {
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

const placeBomb = (entity, entities, bomb) => {
  const newBomb = {
    ...bomb,
    position: entity.position,
    owner: entity,
  }

  entities[newBomb.id] = newBomb;
}

// **IMPORTANT** Perform actions does a lot of sneaky mutation
// May mutate any entity (either the supplied entity, but also any entity referenced in an action)
// May push events into newEvents
const performActions = (actions, entity, entities, newEvents) => {
    while(actions.length > 0) {
      const action = actions.pop();

      if (entity.actionPoints >= action.cost) {
        entity.actionPoints -= action.cost
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
        move(entity, entities, action.direction)
      }
      if (action.type === 'spawn') {
        const { entity } = action;
        entities[entity.id] = entity;
      }
      if (action.type === 'place-bomb') {
        placeBomb(entity, entities, action.bomb)
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
  entity.actionPoints = entity.actionsPerTurn;

  // Update prev position for each entity
  entity.prevPosition = {
    x: entity.position.x,
    y: entity.position.y
  };

  // Perform any exisiting actions (likely just from player input)
  performActions(entity.actions, entity, entities, newEvents);

  // Clear any remaining existing actions for this turn
  entity.actions = [];

  // Perform any actions generated from behaviours
  for (const behaviour of entity.behaviours) {
    const actions = behaviour(entity, entities).reverse();
    performActions(actions, entity, entities, newEvents);
  }
}

export const performTurns = (entities)=> {
  const newEvents = {};
  const player = findPlayer(entities);
  const everythingElse = Object.values(entities).filter(entity => entity.id !== player.id);

  for (const entity of [player, ...everythingElse]) {
    performTurn(entity, entities, newEvents);
  }

  // Remove anything with 0 health
  const remainingEntities = Object.values(entities).filter(entity => entity.health > 0);

  return {
    newEntities: remainingEntities,
    newEvents
  };
}