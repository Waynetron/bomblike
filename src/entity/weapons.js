import { makeEntity, bomb } from './entities';
import { shuffle } from '../math';

const makeWeapon = (props) => makeEntity({
  char: '○',
  solid: false,
  health: 999,
  ...props,
});

export const standardBombBag = (props) => {
  const bombProps = {
    radius: 1,
    health: 3,  // health equates to the number of turns before a bomb explodes
    power: 1,
  };

  return makeWeapon({
    capacity: 1,
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

const weapons = [standardBombBag];

export const getRandomWeapon = (level) => {
  const shuffled = shuffle(weapons);

  return shuffled[0];
}