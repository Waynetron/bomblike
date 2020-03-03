import { makeEntity, bomb } from './entities';
import { shuffle } from '../math';

const makeBombBag = (bagProps, bombProps, extraBagProps) => {
  const weapon = makeEntity({
    char: 'ó',
    solid: false,
    health: 999,
    capacity: bagProps.capacity,
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

export const basicBombBag = (level, props = {}) => {
  const bagProps = {
    capacity: Math.ceil(Math.random() * level),
    description: 'A standard bomb bag',
  }
  const bombProps = {
    radius: Math.ceil(Math.random() * level),
    health: 3,
    power: 1,
  };
  return makeBombBag(bagProps, bombProps, props);
}

export const quickBombBag = (level, props = {}) => {
  const bagProps = {
    capacity: Math.ceil(Math.random() * level),
    description: 'These bombs have short fuses',
  }
  const bombProps = {
    radius: Math.ceil(Math.random() * level),
    health: 2,
    power: 1,
  };
  return makeBombBag(bagProps, bombProps, props);
}

const weapons = [basicBombBag, quickBombBag];

export const getRandomWeapon = () => {
  const shuffled = shuffle(weapons);
  const weapon = shuffled[0];
  
  return weapon;
}