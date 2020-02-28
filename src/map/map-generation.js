import { MAP_WIDTH, MAP_HEIGHT } from '../constants';
import { makeEntity } from '../entity/entities';
import { isAdjacentEdge } from '../map/map-util';
import { staircase, wall, goblin } from '../entity/entities';
import { UP, DOWN, LEFT, RIGHT, shuffle } from '../math';

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

export const generateLevel = (level, player) => {
  const entities = makeEmptyRoom();

  const empty = Object.values(entities).filter(entity => entity.char === '·');
  const shuffledEmpty = shuffle(empty);

  const numEnemies = Math.ceil(level * 1.75);
  for (let i = 0; i < numEnemies; i += 1) {
    const emptyEntity = shuffledEmpty.pop();

    const enemy = goblin({
      position: emptyEntity.position,
    });

    // remove the existing entity and add the enemy in its place (same position)
    delete entities[emptyEntity.id];
    entities[enemy.id] = enemy;
  }

  const staircaseDown = staircase(
    {
      position: {x: 4, y: 4}
    },
    'down'
  );

  return {
      ...entities,
      [player.id]: player,
      [staircaseDown.id]: staircaseDown,
  };
}