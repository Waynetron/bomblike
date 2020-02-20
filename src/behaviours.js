/*
Behaviours are used at the start of a turn to generate a set of actions
*/

import { getEntitiesAt, getEntitiesAtPositions } from './map/map-util';

const [UP, DOWN, LEFT, RIGHT] = [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}]
const add = (a, b) => ({x: a.x + b.x, y: a.y + b.y});
const subtract = (a, b) => ({x: a.x - b.x, y: a.y - b.y});
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
  return [{type: 'move', direction: facing}]
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

  return [{type: 'face', direction: newDirection}];
}

export const attackAdjacentPlayer = (entity, entities) => {
  const adjacent = getAdjacentPositions(entity.position);
  const adjacentEntities = getEntitiesAtPositions(adjacent, entities);
  if (adjacentEntities.some(entity => entity.char === '@')) {
    console.log('@');
    return [{type: 'attack', value: 1, target: entity}];
  }

  return [];
}