/*
Behaviours are used at the start of a turn to generate a set of actions
*/

import { getEntitiesAt, getEntitiesAtPositions, getAdjacentPositions, isWalkable } from '../map/map-util';
import { flame } from './entities';
import { add, subtract, shuffle } from '../math';

export const explodeOnDeath = (entity, entities) => {
  entity.health -= 1;
  if (entity.health > 0) {
    return [];
  } else {
    // Attack adjacent positions
    const adjacent = getAdjacentPositions(entity.position);
    const positions = [...adjacent, entity.position];

    const entitiesToAttack = getEntitiesAtPositions(positions, entities);
    const attackActions = entitiesToAttack.map(entity => (
      {type: 'attack', value: 1, target: entity, cost: 0}
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

export const faceWalkable = (entity, entities) => {
  const { facing } = entity;
  const nextPosition = add(entity.position, facing);
  // Continue facing the existing direction if nothing is in the way
  if (isWalkable(nextPosition, entities)) {
    return [];
  }

  const adjacent = getAdjacentPositions(entity.position);
  const available = adjacent.filter(position => isWalkable(position, entities))

  // Surrounded on all sides, do nothing
  if (available.length === 0) {
    return [];
  }

  const [randomAvailableDirection] = shuffle(available);
  const newDirection = subtract(randomAvailableDirection, entity.position);

  return [{type: 'face', direction: newDirection, cost: 0}];
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
      {type: 'attack', value: 1, target: entity, cost: 0}
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