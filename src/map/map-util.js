import { MAP_WIDTH, MAP_HEIGHT } from '../constants';
import { UP, DOWN, LEFT, RIGHT, add } from '../math';
import { isEqual } from 'lodash';

export const getEntitiesAt = (position, entities) =>
  Object.values(entities).filter(entity => isEqual(entity.position, position));

export const getEntitiesAtPositions = (positions, entities) => (
  positions.map(position => getEntitiesAt(position, entities)).flat()
);

export const isAdjacentEdge = ({x, y}) =>
  x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1;

export const getAdjacentPositions = (position) => [
  add(UP, position), add(DOWN, position), add(LEFT, position), add(RIGHT, position)
];

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