/*
Behaviours are used at the start of a turn to generate a set of actions
*/

import { getEntitiesAt, getEntitiesAtPositions, getAdjacentPositions,
  isWalkable, getPositionsInDirection, isCharInDirection } from '../map/map-util';
import { flame } from './entities';
import { findPlayer } from './entity-util';
import { spooky } from './enemies';
import { UP, DOWN, LEFT, RIGHT, add, subtract, turn, distanceBetween } from '../math';
import { remove } from 'lodash';

const isAttackable = (entity) => {
  if (entity.char === '❒') {
    return false;
  }
  if (entity.solid || entity.char === '@') {
    return true;
  }
  
  return false;
}

const containsAttackable = (position, entities) => {
  return getEntitiesAt(position, entities).find(isAttackable)
}

export const explodeOnDeath = (entity, entities) => {
  const {radius, power} = entity;
  entity.health -= 1;
  if (entity.health > 0) {
    return [];
  } else {
    const attackPositions = [entity.position];
    const spawnPositions = [entity.position];

    for (const direction of [UP, DOWN, LEFT, RIGHT]) {
      const positions = getPositionsInDirection(direction, entity.position, radius, entities)
      const firstSolidIndex = positions.findIndex(position => containsAttackable(position, entities));
      if (firstSolidIndex !== -1) {
        attackPositions.push(positions[firstSolidIndex]);
        spawnPositions.push(...positions.slice(0, firstSolidIndex + 1));
      }
      else {
        spawnPositions.push(...positions);
      }
    }

    const entitiesToAttack = getEntitiesAtPositions(attackPositions, entities);

    const attackActions = entitiesToAttack.map(entity => (
      {type: 'attack', value: power, target: entity, cost: 0}
    ));

    // Spawn fire
    const spawnActions = spawnPositions.map(position => (
      {type: 'spawn', value: 1, entity: flame({position}), cost: 0}
    ));
    return [...attackActions, ...spawnActions];
  }
}

export const spawnGhostOnDeath = (entity, entities) => {
  entity.health -= 1;
  if (entity.health > 0) {
    return [];
  } else {
    const { position } = entity;
    return [{type: 'spawn', value: 1, entity: spooky({position}), cost: 0}]    
  }
}

export const attackSelf = (entity, entities) => {
  return [{type: 'attack', value: 1, target: entity, cost: 0}]
}

export const walkInALine = (entity, entities) => {
  const { facing } = entity;
  return [{type: 'move', direction: facing, cost: 1}]
}

export const pursuePlayerInLineOfSight = (entity, entities) => {
  for (const direction of [UP, DOWN, LEFT, RIGHT]) {
    const range = 12;
    if (isCharInDirection('@', direction, entity.position, range, entities)) {
      return [
        {type: 'move', direction, cost: 1},
        {type: 'face', direction, cost: 0}
      ]
    }

  }
  return [];
}

export const pursueBombInLineOfSight = (entity, entities) => {
  for (const direction of [UP, DOWN, LEFT, RIGHT]) {
    const range = 12;
    if (isCharInDirection('b', direction, entity.position, range, entities)) {
      return [
        {type: 'move', direction, cost: 1},
        {type: 'face', direction, cost: 0}
      ]
    }

  }
  return [];
}

export const pursuePlayerThroughWalls = (entity, entities) => {
  const player = findPlayer(entities);
  const x = player.position.x > entity.position.x ? 1 : -1;
  const y = player.position.y > entity.position.y ? 1 : -1;

  const direction = Math.random() > 0.5 ? {x: 0, y: y} : {x: x, y: 0};

  return [{type: 'move', direction, cost: 1, force: true}];
}

export const pursuePlayer = (entity, entities) => {
  const player = findPlayer(entities);
  
  let closestDirection;
  let bestDistance = distanceBetween(entity.position, player.position);

  for (const direction of [UP, DOWN, LEFT, RIGHT]) {
    const position = add(direction, entity.position);
    const distance = distanceBetween(position, player.position)

    if (isWalkable(position, entities) && distance < bestDistance) {
      closestDirection = direction;
      bestDistance = distance;
    }
  }

  if (closestDirection) {
    return [{type: 'move', direction: closestDirection, cost: 1}];
  }

  return [];
}

export const faceWalkable = (entity, entities) => {
  const { facing } = entity;

  // The order is intentional. The forward (facing) direction is placed first, so that
  // the entity will continue moving in that direction if it can.
  // Turning around is placed at the end, so that turning left / right is favoured.
  const directions = [facing, turn(-90, facing), turn(90, facing), turn(180, facing)];

  for (const direction of directions) {
    const position = add(direction, entity.position);
    if (isWalkable(position, entities)) {
      return [{type: 'face', direction, cost: 0}]
    }
  }

  // Surrounded on all sides, do nothing
  return [];
}

export const turnLeft = (entity, entities) => {
  const { facing } = entity;

  // The order is intentional. The forward (facing) direction is placed first, so that
  // the entity will continue moving in that direction if it can.
  // Turning around is placed at the end, so that turning left / right is favoured.
  const directions = [turn(-90, facing), turn(90, facing), facing, turn(180, facing)];

  for (const direction of directions) {
    const position = add(direction, entity.position);
    if (isWalkable(position, entities)) {
      return [{type: 'face', direction, cost: 0}]
    }
  }

  // Surrounded on all sides, do nothing
  return [];
}

export const turnRight = (entity, entities) => {
  const { facing } = entity;

  // The order is intentional. The forward (facing) direction is placed first, so that
  // the entity will continue moving in that direction if it can.
  // Turning around is placed at the end, so that turning left / right is favoured.
  const directions = [turn(90, facing), turn(-90, facing), facing, turn(180, facing)];

  for (const direction of directions) {
    const position = add(direction, entity.position);
    if (isWalkable(position, entities)) {
      return [{type: 'face', direction, cost: 0}]
    }
  }

  // Surrounded on all sides, do nothing
  return [];
}

export const attackPlayer = (entity, entities) => {
  const colliding = getEntitiesAt(entity.position, entities);
  const player = colliding.find(entity => entity.char === '@');

  if (player) {
    return [
      {type: 'attack', value: 1, target: player, cost: 0}
    ];
  }

  return [];
}

export const eatBomb = (entity, entities) => {
  const adjacent = getAdjacentPositions(entity.position);
  for (const position of adjacent) {
    const adjacentEntities = getEntitiesAt(position, entities);
    const bomb = adjacentEntities.find(entity => entity.char === 'b');
    if (bomb) {
      const direction = subtract(position, entity.position);
      
      return [
        {type: 'eat', target: bomb, cost: 0},
        {type: 'move', direction, cost: 1}
      ];
    }
  }

  return [];
}

export const attackAdjacentPlayer = (entity, entities) => {
  const adjacent = getAdjacentPositions(entity.position);
  const adjacentEntities = getEntitiesAtPositions(adjacent, entities);
  const player = adjacentEntities.find(entity => entity.char === '@');
  if (player) {
    return [{type: 'attack', value: 1, target: player, cost: 1}];
  }

  return [];
}

export const attackAdjacentPlayerAndDie = (entity, entities) => {
  const adjacent = getAdjacentPositions(entity.position);
  const adjacentEntities = getEntitiesAtPositions(adjacent, entities);
  const player = adjacentEntities.find(entity => entity.char === '@');
  if (player) {
    return [
      {type: 'attack', value: 1, target: player, cost: 1},
      {type: 'attack', value: 1, target: entity, cost: 1}
    ];
  }

  return [];
}

export const pickUpWeapons = (entity, entities) => {  
  const collidingEntities = getEntitiesAt(entity.position, entities);  
  const weapon = collidingEntities.find(entity => entity.type === 'weapon');
  if (!weapon) {
    return [];
  }

  // pick up the weapon
  entity.weapon = weapon;
  remove(entities, entity => entity.id === weapon.id);
  
  return [];
}

export const pickUpArmour = (entity, entities) => {  
  const collidingEntities = getEntitiesAt(entity.position, entities);  
  const armour = collidingEntities.find(entity => entity.type === 'armour');
  if (!armour) {
    return [];
  }

  // pick up the armour
  entity.armour = armour;
  remove(entities, entity => entity.id === armour.id);
  
  return [];
}

export const pickUpConsumables = (entity, entities) => {  
  const collidingEntities = getEntitiesAt(entity.position, entities);  
  const item = collidingEntities.find(entity => entity.type === 'consumable');
  if (!item) {
    return [];
  }

  // use it right away, then discard it
  const action = item.use(entity);
  remove(entities, entity => entity.id === item.id);
  
  return [action];
}