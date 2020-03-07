import { walkInALine, faceWalkable, attackPlayer, pursuePlayerInLineOfSight,
  pursueBombInLineOfSight, eatBomb, pursuePlayerThroughWalls,
  spawnGhostOnDeath } from './behaviours';
import { makeEntity } from './entities';

export const gooblini = (props) => {
  return makeEntity({
    char: 'G',
    solid: true,
    behaviours: [walkInALine, faceWalkable, attackPlayer],
    name: 'gooblini',
    description: "Basic enemy, but best not touch it",
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
    char: 'S',
    solid: false,
    health: 99,
    speed: 'half',
    behaviours: [pursuePlayerThroughWalls, attackPlayer],
    name: 'spooky ghost',
    description: 'Oooooo spooky',
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
    [gooblini],
    [gooblini, charger],
    [gooblini, charger, eater],
    [gooblini, charger, eater],
    [gooblini, charger, eater],
  ];

  const available = levels[level - 1];
  const index = Math.floor(Math.random() * available.length);
  return available[index](props);
}