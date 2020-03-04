import { walkInALine, faceWalkable, attackPlayer, pursuePlayerInLineOfSight } from './behaviours';
import { makeEntity } from './entities';

export const gooblini = (props) => {
  return makeEntity({
    char: 'G',
    solid: true,
    behaviours: [walkInALine, faceWalkable, attackPlayer],
    name: 'Gooblini',
    description: "Basic enemy, but best not touch it",
    ...props,
  })
};

export const charger = (props) => {
  return makeEntity({
    char: 'C',
    solid: true,
    behaviours: [pursuePlayerInLineOfSight, walkInALine, attackPlayer],
    name: 'Charger',
    description: 'If it sees you, it charges toward you',
    ...props,
  })
};

export const getRandomEnemy = (level, props) => {
  const levels = [
    [gooblini],
    [gooblini, charger],
    [gooblini, charger],
    [gooblini, charger],
    [gooblini, charger],
  ];

  const available = levels[level - 1];
  const index = Math.floor(Math.random() * available.length);
  return available[index](props);
}