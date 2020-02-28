import { findPlayer } from './entity/entities';
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

const performActions = (entity, entities, newEvents) => {
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
        move(entity, entities, action.direction)
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
  performActions(entity, entities, newEvents);

  // Clear actions
  entity.actions = [];
}

export const performTurns = (entities)=> {
  const newEvents = {};
  const player = findPlayer(entities);
  const everythingElse = Object.values(entities).filter(entity => entity.id !== player.id);

  for (const entity of [...everythingElse, player]) {
    performTurn(entity, entities, newEvents);
  }

  // Remove anything with 0 health
  const remainingEntities = Object.values(entities).filter(entity => entity.health > 0);

  return {
    newEntities: remainingEntities,
    newEvents
  };
}