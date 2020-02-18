import { MAP_WIDTH, MAP_HEIGHT } from '../constants';
import { isEqual } from 'lodash';

// export const getKey = (position) => `${position.x},${position.y}`;

export const getTilesAt = (position, tiles) =>
  Object.values(tiles).filter(tile => isEqual(tile.position, position));

export const isAdjacentEdge = (x, y) =>
  x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1;