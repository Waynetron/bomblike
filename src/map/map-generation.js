import { MAP_WIDTH, MAP_HEIGHT } from '../constants';
import { makeEntity } from '../entities';
import { isAdjacentEdge } from '../map/map-util';

export const makeEmptyRoom = () => {
  const entities = {};
  for (let x = 0; x < MAP_WIDTH; x += 1) {
    for (let y = 0; y < MAP_HEIGHT; y += 1) {
      let char, solid;
      if (isAdjacentEdge(x, y)) {
        char = '#';
        solid = true;
      }
      else {
        char = '.';
        solid = false;
      }

      const entity = makeEntity({
        char,
        position: {x, y}, 
        solid
      });

      entities[entity.id] = entity;
    }  
  }

  return entities;
}