import { MAP_WIDTH, MAP_HEIGHT } from '../constants';
import { isEqual } from 'lodash';

export const getEntitiesAt = (position, entities) =>
  Object.values(entities).filter(entity => isEqual(entity.position, position));

export const getEntitiesAtPositions = (positions, entities) => (
  positions.map(position => getEntitiesAt(position, entities)).flat()
);

export const isAdjacentEdge = (x, y) =>
  x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1;