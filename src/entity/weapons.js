import { makeEntity, bomb } from './entities';
import { shuffle } from '../math';

const makeBombBag = (bagProps, bombProps, extraBagProps) => {
  const weapon = makeEntity({
    char: 'ó',
    type: 'weapon',
    solid: false,
    health: 999,
    capacity: bagProps.capacity || 1,
    description: 'A standard bomb bag',
    stats: {
      radius: bombProps.radius,
      power: bombProps.power,
      capacity: bagProps.capacity,
      // health displayed as timer to users
      timer: bombProps.health,
    },
    use: (entity) => ({
      type: 'place-bomb',
      cost: 1,
      bomb: bomb({...bombProps, position: entity.position})
    }),
    ...extraBagProps,
  });

  return weapon;
}

// health equates to the number of turns before a bomb explodes
// capacity is how many bombs can be active at a time

export const proceduralBombBag = (level, props = {}) => {
  const largeRadius = {radius: 2};
  const veryLargeRadius = {radius: 3};
  const shortFuse = {health: 2};
  const longFuse = {health: 5};
  
  let bagProps = {};
  let bombProps = {};

  const possibleBagTraitCombinations = [
    [veryLargeRadius, longFuse],
    [shortFuse],
    [largeRadius],
    [shortFuse, largeRadius],
    [veryLargeRadius],
  ]
  const traits = shuffle(possibleBagTraitCombinations).pop();
  for (const trait of traits) {
    bombProps = {...bombProps, ...trait}
  }
  
  return makeBombBag(bagProps, bombProps, props);
}

export const starterBombBag = (level, props = {}) => {
  const bagProps = {
    capacity: 1,
    description: 'A starter bomb bag',
  }
  const bombProps = {
    radius: Math.ceil(Math.random() * level),
    health: 3,
    power: 1,
  };
  return makeBombBag(bagProps, bombProps, props);
}

const weapons = [proceduralBombBag];

export const getRandomWeapon = () => {
  const shuffled = shuffle(weapons);
  const weapon = shuffled[0];
  
  return weapon;
}