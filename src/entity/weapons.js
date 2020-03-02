import { makeEntity, bomb } from './entities';
import { shuffle } from '../math';

const baseWeaponProps = {
  char: 'ó',
  solid: false,
  health: 999,
}

export const basicBombBag = (props, level) => {
  // health equates to the number of turns before a bomb explodes
  const bombProps = {
    radius: Math.ceil(Math.random() * level),
    health: 3,
    power: 1
  };

  return makeEntity({
    ...baseWeaponProps,
    capacity: Math.ceil(Math.random() * level),
    description: 'A standard bomb bag',
    value: 1,
    stats: {...bombProps},
    use: (entity) => ({
      type: 'place-bomb',
      cost: 1,
      bomb: bomb({...bombProps, position: entity.position})
    }),
    ...props,
  })
}

export const quickBombBag = (props, level) => {
  const bombProps = {
    radius: Math.ceil(Math.random() * level),
    health: 2,
    power: 1
  };

  return makeEntity({
    ...baseWeaponProps,
    capacity: Math.ceil(Math.random() * level),
    description: 'These bombs have short fuses',
    value: 1,
    stats: {...bombProps},
    use: (entity) => ({
      type: 'place-bomb',
      cost: 1,
      bomb: bomb({...bombProps, position: entity.position})
    }),
    ...props,
  })
}

const weapons = [basicBombBag, quickBombBag];

export const getRandomWeapon = () => {
  const shuffled = shuffle(weapons);
  const weapon = shuffled[0];
  
  return weapon;
}