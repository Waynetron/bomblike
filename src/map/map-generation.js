import { MAP_WIDTH, MAP_HEIGHT } from '../constants';
import { makeEntity } from '../entity/entities';
import { isAdjacentEdge, getAdjacentPositions, getEntitiesAt } from '../map/map-util';
import { staircase, wall, goblin } from '../entity/entities';
import { UP, DOWN, LEFT, RIGHT, shuffle } from '../math';

export const makeEmptyRoom = () => {
  const entities = {};
  for (let x = 0; x < MAP_WIDTH; x += 1) {
    for (let y = 0; y < MAP_HEIGHT; y += 1) {
      const position = {x, y};
      if (isAdjacentEdge(position) || (x % 2 === 0 && y % 2 === 0)) {
        const unbreakableWall = wall({position}, false);
        entities[unbreakableWall.id] = unbreakableWall;
      }
      else if (Math.random() > 0.8) {
        const breakableWall = wall({position}, true);
        entities[breakableWall.id] = breakableWall;
      }
      else {
        const empty = makeEntity({
          char: '·',
          position,
          solid: false,
        });
        entities[empty.id] = empty;
      }
    }
  }

  return entities;
}

const isOdd = position => (position.x % 2 !== 0 && position.y % 2 !== 0);

export const generateLevel = (level, player) => {
  const entities = makeEmptyRoom();

  const empty = Object.values(entities).filter(entity => entity.char === '·');
  let shuffledEmpty = shuffle(empty);

  // Add player to an odd empty space
  const oddEmpty = shuffledEmpty.filter(entity => isOdd(entity.position));
  const evenEmpty = shuffledEmpty.filter(entity => !isOdd(entity.position));

  const emptyEntity = oddEmpty.pop();
  player.position = emptyEntity.position;
  entities[player.id] = player;
  delete entities[emptyEntity.id];

  // merge odd and even back together
  shuffledEmpty = [...oddEmpty, ...evenEmpty];

  // Remove breakable walls adjacent to player
  const adjacentPositons = getAdjacentPositions(player.position);
  for (const position of adjacentPositons) {
    if (!isAdjacentEdge(position)) {
      const adjacentEntities = getEntitiesAt(position, entities);
      for (const entity of adjacentEntities) {
        delete entities[entity.id];
      }
    }
  }

  // Add enemies
  const numEnemies = Math.ceil(level * 1.75);
  for (let i = 0; i < numEnemies; i += 1) {
    const emptyEntity = shuffledEmpty.pop();

    const enemy = goblin({
      position: emptyEntity.position,
    });

    // remove the existing entity and add the enemy in its place (same position)
    entities[enemy.id] = enemy;
    delete entities[emptyEntity.id];
  }

  // Add staircase
  // STAIRCASE SHOULD ACTUALLY GO UNDERNEATH A BREAKABLE WALL
  const emptyEntity2 = shuffledEmpty.pop();
  const staircaseDown = staircase({
    position: emptyEntity2.position
  });
  entities[staircaseDown.id] = staircaseDown;
  delete entities[emptyEntity.id];

  return {
      ...entities,
      [staircaseDown.id]: staircaseDown,
  };
}