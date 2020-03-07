import { findPlayer, trail } from './entity/entities';
import { getEntitiesAt } from './map/map-util';
import { subtract } from './math';

let totalTurns = 0;

export const move = (entity, entities, direction, force = false) => {
  const newPosition = {
    x: entity.position.x + direction.x,
    y: entity.position.y + direction.y
  }

  // Check if anything is in the way (unless force is true)
  const upcomingEntities = getEntitiesAt(newPosition, entities);
  if (!force && upcomingEntities.filter(upcoming => upcoming.solid).length > 0) {
    return false;
  }

  // Add a trail entity at he old position
  entities.push(trail({position: entity.position}));

  // Move the entity into the new position
  entity.position = newPosition
  return true;
}

const placeBomb = (entity, entities, bomb) => {
  const newBomb = {
    ...bomb,
    position: entity.position,
    owner: entity,
  }

  entities.push(newBomb);
}

// **IMPORTANT** Perform actions does a lot of sneaky mutation
// May mutate any entity (either the supplied entity, but also any entity referenced in an action)
// May push events into newEvents
const performActions = (actions, entity, entities, newEvents) => {
    const player = findPlayer(entities);

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
      // similar to attack, but immediately sets target to !alive to avoid triggering explosions
      if (action.type === 'eat') {
        action.target.alive = false;
        action.target.solid = false;
        newEvents.shake = true;
      }
      if (action.type === 'attack') {
        const { value, target } = action;
        if (target.armour) {
          target.armour.defense -= value;
        }
        else {
          target.health -= value;
        }
        entity.status['attacking'] = subtract(target.position, entity.position);
        newEvents.shake = true;
        if (target.id === player.id && player.health <= 0) {
          newEvents.playerKiller = entity;
        }
      }
      if (action.type === 'move') {
        move(entity, entities, action.direction, action.force)
      }
      if (action.type === 'spawn') {
        const { entity } = action;
        entities.push(entity);
      }
      if (action.type === 'place-bomb') {
        placeBomb(entity, entities, action.bomb)
      }
      if (action.type === 'face') {
        entity.facing = action.direction;
      }
    }
}

const performTurn = (entity, entities, newEvents) => {
  // entities with speed 'half' only perform every 2nd turn
  if (entity.speed === 'half' && totalTurns % 2 === 0) {
    return
  }

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
  const everythingElse = entities.filter(entity => entity.id !== player.id);

  for (const entity of [player, ...everythingElse]) {
    performTurn(entity, entities, newEvents);
  }

  // Remove anything that is dead
  for (const entity of entities) {
    if (entity.armour && entity.armour.defense <= 0) {
      entity.armour = null;
    }
    if (entity.health <= 0) {
      entity.alive = false;
    }
  }
  const remainingEntities = entities.filter(entity => entity.alive);

  totalTurns++;

  return {
    newEntities: remainingEntities,
    newEvents
  };
}