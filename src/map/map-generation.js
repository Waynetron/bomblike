import { MAP_WIDTH, MAP_HEIGHT } from '../constants';
import { makeEntity } from '../entity/entities';
import { isAdjacentEdge, getAdjacentPositions, getEntitiesAt } from '../map/map-util';
import { empty, staircase, wall, goblin } from '../entity/entities';
import { UP, DOWN, LEFT, RIGHT, shuffle } from '../math';
import { isEqual } from 'lodash';

export const makeRoomWithPlayerAndWalls = (player) => {
  const entities = [player];

  for (let x = 0; x < MAP_WIDTH; x += 1) {
    for (let y = 0; y < MAP_HEIGHT; y += 1) {
      const position = {x, y};
      // don't place anything where the player is
      if (isEqual(position, player.position)) {
        continue;
      }

      // don't place anything next to where the player is unless it is an edge wall
      const adjacentPositons = getAdjacentPositions(player.position);
      const isAdjacentPlayer = adjacentPositons.find(adjPosition => isEqual(position, adjPosition));
      if (!isAdjacentEdge(position) && isAdjacentPlayer) {
        continue;
      }

      if (isAdjacentEdge(position) || (x % 2 === 0 && y % 2 === 0)) {
        const unbreakableWall = wall({position}, false);
        entities.push(unbreakableWall);
      }
      else if (Math.random() > 0.8) {
        const breakableWall = wall({position}, true);
        entities.push(breakableWall);
      }
      else {
        const emptyEntity = empty({position});
        entities.push(emptyEntity);
      }
    }
  }

  return entities;
}

export const generateLevel = (level, player) => {
  const entities = makeRoomWithPlayerAndWalls(player);

  // Add enemies
  const emptyEntities = entities.filter(entity => entity.char === '·');
  let shuffledEmptyEntities = shuffle(emptyEntities);
  const numEnemies = Math.ceil(level * 1.75);
  for (let i = 0; i < numEnemies; i += 1) {
    const emptyEntity = shuffledEmptyEntities.pop();

    const enemy = goblin({
      position: emptyEntity.position,
    });
    entities.push(enemy);
  }

  // Add staircase
  // STAIRCASE SHOULD ACTUALLY GO UNDERNEATH A BREAKABLE WALL
  const walls = entities.filter(entity => entity.char === '+')
  const randomWall = shuffle(walls).pop();
  const staircaseDown = staircase({
    position: randomWall.position
  });
  entities.push(staircaseDown);

  return entities;
}