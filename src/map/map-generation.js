import { MAP_WIDTH, MAP_HEIGHT } from '../constants';
import { makeEntity } from '../entities';
import { isAdjacentEdge } from '../map/map-util';
import { walkInALine, faceWalkable, attackAdjacentPlayerAndDie } from '../behaviours';
import { staircase } from '../entities';

export const makeEmptyRoom = () => {
  const entities = {};
  for (let x = 0; x < MAP_WIDTH; x += 1) {
    for (let y = 0; y < MAP_HEIGHT; y += 1) {
      let char, solid;
      if (isAdjacentEdge(x, y) || Math.random() > 0.8) {
        char = '#';
        solid = true;
      }
      else {
        char = '·';
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

export const generateLevel = (player) => {
  const emptyRoom = makeEmptyRoom();
  const enemy = makeEntity({
    char: 'g',
    position: {x: 9, y: 9},
    solid: true,
    behaviours: [walkInALine, faceWalkable, attackAdjacentPlayerAndDie],
    actions: [{type: 'move', direction: {x: 0, y: -1}}]
  });

  const staircaseDown = staircase(
    {
      position: {x: 4, y: 4}
    },
    'down'
  );

  return {
      ...emptyRoom,
      [player.id]: player,
      [enemy.id]: enemy,
      [staircaseDown.id]: staircaseDown,
  };
}