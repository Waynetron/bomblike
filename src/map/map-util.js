import { MAP_WIDTH, MAP_HEIGHT } from '../constants';
import { UP, DOWN, LEFT, RIGHT, add } from '../math';
import { isEqual } from 'lodash';

export const getEntitiesAt = (position, entities) =>
  entities.filter(entity => isEqual(entity.position, position));

export const getEntitiesAtPositions = (positions, entities) => (
  positions.map(position => getEntitiesAt(position, entities)).flat()
);

export const isAdjacentEdge = ({x, y}) =>
  x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1;

export const getAdjacentPositions = (position) => [
  add(UP, position), add(DOWN, position), add(LEFT, position), add(RIGHT, position)
];

export const getPositionsInDirection = (direction, startPosition, distance) => {
  const positions = [];
  while (distance > 0) {
    const scaledDirection = {x: direction.x * distance, y: direction.y * distance};
    const offsetPosition = add(startPosition, scaledDirection);
    positions.push(offsetPosition);
    distance -= 1;
  }
  return positions.reverse();
};

export const isCharInDirection = (char, direction, startPosition, distance, entities) => {
  const positions = getPositionsInDirection(direction, startPosition, distance);
  for (const position of positions) {
    const entitiesAtPosition = getEntitiesAt(position, entities);
    for (const entity of entitiesAtPosition) {
      if (entity.char === char) {
        return true;
      }
      else if (entity.solid) {
        return false;
      }
    }
  }
  return false;
};

export const isWalkable = (position, entities) => {
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