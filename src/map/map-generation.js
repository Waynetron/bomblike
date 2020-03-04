import { MAP_WIDTH, MAP_HEIGHT } from '../constants';
import { isAdjacentEdge, getAdjacentPositions } from '../map/map-util';
import { empty, staircase, wall } from '../entity/entities';
import { getRandomEnemy } from '../entity/enemies';
import { getRandomWeapon } from '../entity/weapons';
import { shuffle } from '../math';
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

    const enemy = getRandomEnemy(level, {position: emptyEntity.position});
    entities.push(enemy);
  }

  // Add staircase and weapons underneath breakable walls
  const walls = entities.filter(entity => entity.char === '+')
  const shuffledWalls = shuffle(walls);
  const staircaseDown = staircase({
    position: shuffledWalls.pop().position
  });
  entities.push(staircaseDown);

  for (let i = 0; i < 2; i += 1) {
    const weaponFactory = getRandomWeapon();
    const bagProps = {position: shuffledWalls.pop().position};
    const weapon = weaponFactory(level + 1, bagProps);
    entities.push(weapon);
  }

  return entities;
}