import { MAP_WIDTH, MAP_HEIGHT } from './constants';
import { isAdjacentEdge, getAdjacentPositions } from '../map/map-util';
import { empty, staircase, wall, hole } from '../entity/entities';
import { getRandomEnemy, ghostSpawner } from '../entity/enemies';
import { getRandomWeapon } from '../entity/weapons';
import { shuffle, distanceBetween } from '../math';
import { isEqual } from 'lodash';

export const makeRoomWithPlayerAndWalls = (player) => {
  const entities = [player];
  const emptyEntities = [];

  for (let x = 0; x < MAP_WIDTH; x += 1) {
    for (let y = 0; y < MAP_HEIGHT; y += 1) {
      const position = {x, y};
      // don't place anything where the player is
      if (isEqual(position, player.position)) {
        continue;
      }

      const adjacentPositons = getAdjacentPositions(player.position);
      const isAdjacentPlayer = adjacentPositons.find(adjPosition => isEqual(position, adjPosition));

      if (isAdjacentEdge(position) || (x % 2 === 0 && y % 2 === 0)) {
        const unbreakableWall = wall({position}, false);
        entities.push(unbreakableWall);
      }
      // don't place breakable walls next to where the player is
      else if (!isAdjacentPlayer) {
        const emptyEntity = empty({position});
        emptyEntities.push(emptyEntity);
      }
    }
  }

  let shuffledEmptyEntities = shuffle(emptyEntities);

  // need to leave some spots for the player and enemies to fit and walk around
  const maxThings = emptyEntities.length - 16;
  // need to have at least enough breakable walls to hide items and stairs
  const minBreakableWalls = 5;
  const numBreakableWalls = Math.min(Math.random() * (maxThings / 4) + minBreakableWalls, maxThings);
  const remainingRandomSpots = maxThings - numBreakableWalls;
  const numHoles = Math.min(Math.random() * remainingRandomSpots / 2, 0);

  for (let i = 0; i < numBreakableWalls; i += 1) {
    const position = shuffledEmptyEntities.pop().position;
     entities.push(wall({position}, true));
  }

  for (let i = 0; i < numHoles; i += 1) {
    const position = shuffledEmptyEntities.pop().position;
     entities.push(hole({position}));
  }

  return [...entities, ...shuffledEmptyEntities];
}

// removes entities that are too close to the player
const excludeClosest = (entities, player) => {  
  entities.sort((a, b)=> {
    const distanceA = distanceBetween(a.position, player.position);
    const distanceB = distanceBetween(b.position, player.position);
    return distanceA - distanceB;
  })
  return entities.slice(Math.floor(entities.length / 4));
}

export const generateLevel = (level, player) => {
  const entities = makeRoomWithPlayerAndWalls(player);

  // Add enemies
  const emptyEntities = entities.filter(entity => entity.char === '·');
  let shuffledFurthestEmpties = shuffle(excludeClosest(emptyEntities, player));
  const numEnemies = Math.ceil(level * 1.75);
  for (let i = 0; i < numEnemies; i += 1) {
    const emptyEntity = shuffledFurthestEmpties.pop();

    const enemy = getRandomEnemy(level, {position: emptyEntity.position});
    entities.push(enemy);
  }

  // Add ghost spawner (spawns a ghost if the player is taking too long)
  const ghostsProps = [
    {health: 75, position: {x: -2, y: -2}},
    {health: 100, position: {x: MAP_WIDTH + 1, y: -2}},
    {health: 125, position: {x: MAP_WIDTH + 1, y: MAP_HEIGHT + 1}},
    {health: 150, position: {x: -2, y: MAP_HEIGHT + 1}},
  ]
  for (const props of ghostsProps) {
    const spawner = ghostSpawner(props);
    entities.push(spawner); 
  }

  // Add staircase and weapons underneath breakable walls
  const walls = entities.filter(entity => entity.char === '+');
  const shuffledFurthestWalls = shuffle(excludeClosest(walls, player));

  const staircaseDown = staircase({
    position: shuffledFurthestWalls.pop().position
  });
  entities.push(staircaseDown);

  const weaponFactory = getRandomWeapon();
  const bagProps = {position: shuffledFurthestWalls.pop().position};
  const weapon = weaponFactory(level + 1, bagProps);
  entities.push(weapon);

  // finally, remove all the empty entities
  return entities.filter(entity => entity.char !== '·');
}