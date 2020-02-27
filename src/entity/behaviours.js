/*
Behaviours are used at the start of a turn to generate a set of actions
*/

import { getEntitiesAt, getEntitiesAtPositions } from '../map/map-util';
import { UP, DOWN, LEFT, RIGHT, add, subtract } from '../math';

const getAdjacentPositions = (position) => [
  add(UP, position), add(DOWN, position), add(LEFT, position), add(RIGHT, position)
];

const shuffle = (original) => {
  const shuffled = [...original];
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const isWalkable = (position, entities) => {
  const entitiesAtPostion = getEntitiesAt(position, entities);

  // nothing there at all
  if (entitiesAtPostion.length === 0) {
    return true;
  }

  // something solid there
  if (entitiesAtPostion.some(entity => entity.solid)) {
    return false;
  }

  // something there, but it can be walked over
  return true;
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
  const stairsDown = collidingEntities.find(entity => entity.char === '<');
  const stairsUp = collidingEntities.find(entity => entity.char === '>');

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