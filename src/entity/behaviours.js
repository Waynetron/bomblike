/*
Behaviours are used at the start of a turn to generate a set of actions
*/

import { getEntitiesAt, getEntitiesAtPositions, getAdjacentPositions,
  isWalkable, getPositionsInDirection, isPlayerInDirection } from '../map/map-util';
import { flame, findPlayer } from './entities';
import { UP, DOWN, LEFT, RIGHT, add, subtract, turn, shuffle } from '../math';
import { remove } from 'lodash';

export const explodeOnDeath = (entity, entities) => {
  const {radius, power} = entity;
  entity.health -= 1;
  if (entity.health > 0) {
    return [];
  } else {
    const positions = [
      ...getPositionsInDirection(UP, entity.position, radius, entities),
      ...getPositionsInDirection(DOWN, entity.position, radius, entities),
      ...getPositionsInDirection(LEFT, entity.position, radius, entities),
      ...getPositionsInDirection(RIGHT, entity.position, radius, entities),
      entity.position,
    ];
    const entitiesToAttack = getEntitiesAtPositions(positions, entities);

    const attackActions = entitiesToAttack.map(entity => (
      {type: 'attack', value: power, target: entity, cost: 0}
    ));

    // Spawn fire
    const spawnActions = positions.map(position => (
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
    if (isPlayerInDirection(direction, entity.position, range, entities)) {
      return [
        {type: 'move', direction, cost: 1},
        {type: 'face', direction, cost: 0}
      ]
    }

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

export const attackPlayer = (entity, entities) => {
  const colliding = getEntitiesAt(entity.position, entities);
  const player = colliding.find(entity => entity.char === '@');

  if (player) {
    return [{type: 'attack', value: 1, target: player, cost: 0}];
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