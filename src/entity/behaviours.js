/*
Behaviours are used at the start of a turn to generate a set of actions
*/

import { getEntitiesAt, getEntitiesAtPositions, getAdjacentPositions,
  isWalkable, getPositionsInDirection, isCharInDirection } from '../map/map-util';
import { flame, findPlayer } from './entities';
import { UP, DOWN, LEFT, RIGHT, add, subtract, turn, shuffle } from '../math';
import { remove } from 'lodash';

const containsAttackable = (position, entities) => {
  return getEntitiesAt(position, entities).find(
    entity => entity.solid || entity.char === '@'
  )
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

export const attackPlayer = (entity, entities) => {
  const colliding = getEntitiesAt(entity.position, entities);
  const player = colliding.find(entity => entity.char === '@');

  if (player) {
    return [{type: 'attack', value: 1, target: player, cost: 0}];
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

export const traverseStairs = (entity, entities) => {
  const collidingEntities = getEntitiesAt(entity.position, entities);
  const stairsDown = collidingEntities.find(entity => entity.char === '>');
  const stairsUp = collidingEntities.find(entity => entity.char === '<');

  if (stairsDown) {
    return [
      {type: 'change-level', value: 1, cost: 0},
    ];
  }

  if (stairsUp) {
    return [
      {type: 'change-level', value: -1, cost: 0},
    ];
  }

  return [];
}

export const pickUpWeapons = (entity, entities) => {
  const oldWeapon = entity.weapon;
  oldWeapon.position = entity.position;
  
  const collidingEntities = getEntitiesAt(entity.position, entities);  
  const newWeapon = collidingEntities.find(entity => entity.use);
  if (!newWeapon) {
    return [];
  }

  // pick up the new weapon
  entity.weapon = newWeapon;
  remove(entities, entity => entity.id === newWeapon.id);
  
  return [];
}