import { walkInALine, faceWalkable, attackPlayer, pursuePlayerInLineOfSight,
  pursueBombInLineOfSight, eatBomb, pursuePlayerThroughWalls, pursuePlayer, turnLeft, turnRight,
  spawnGhostOnDeath } from './behaviours';
import { makeEntity } from './entities';

export const wanderer = (props) => {
  return makeEntity({
    char: 'W',
    solid: true,
    behaviours: [walkInALine, faceWalkable, attackPlayer],
    name: 'wanderer',
    description: "Moves until it hits something, then turns.",
    ...props,
  })
};

export const leftie = (props) => {
  return makeEntity({
    char: 'L',
    solid: true,
    behaviours: [walkInALine, turnLeft, attackPlayer],
    name: 'leftie',
    description: "It's not an ambi-turner",
    ...props,
  })
};

export const rightie = (props) => {
  return makeEntity({
    char: 'L',
    solid: true,
    behaviours: [walkInALine, turnRight, attackPlayer],
    name: 'leftie',
    description: "It's not an ambi-turner",
    ...props,
  })
};

export const charger = (props) => {
  return makeEntity({
    char: 'C',
    name: 'charger',
    solid: true,
    facing: {x: 0, y: 0},
    behaviours: [pursuePlayerInLineOfSight, walkInALine, attackPlayer],
    name: 'charger',
    description: 'If it sees you, it charges toward you',
    ...props,
  })
};

export const eater = (props) => {
  return makeEntity({
    char: 'E',
    solid: true,
    behaviours: [eatBomb, pursueBombInLineOfSight, attackPlayer],
    name: 'bombeater',
    description: 'Eats bombs, om nom',
    ...props,
  })
};

export const spooky = (props) => {
  return makeEntity({
    char: '!',
    solid: false,
    health: 99,
    speed: 'half',
    behaviours: [pursuePlayerThroughWalls, attackPlayer],
    name: 'hunger clock',
    description: "Oh no, it's the fun police!",
    ...props,
  })
};

export const seeker = (props) => {
  return makeEntity({
    char: 'S',
    solid: true,
    health: 1,
    speed: 'half',
    behaviours: [pursuePlayer, attackPlayer],
    name: 'seeker',
    description: 'It just wants to be close to you',
    ...props,
  })
};

export const ghostSpawner = (props) => {
  return makeEntity({
    char: 's',
    solid: false,
    health: 5,
    behaviours: [spawnGhostOnDeath],
    name: 'ghost spawner',
    description: '',
    visible: false,
    ...props,
  })
};

export const getRandomEnemy = (level, props) => {
  const levels = [
    [wanderer],
    [wanderer, charger],
    [wanderer, charger, seeker, eater],
    [wanderer, charger, seeker, eater],
    [wanderer, charger, seeker, eater],
  ];

  const available = levels[level - 1];
  const index = Math.floor(Math.random() * available.length);
  return available[index](props);
}