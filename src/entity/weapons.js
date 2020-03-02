import { makeEntity, bomb } from './entities';

export const standardBombBag = () => {
  const bombProps = {
    radius: 1,
    health: 3,  // health equates to the number of turns before a bomb explodes
    power: 1,
  };

  return makeEntity({
    char: '○',
    solid: false,
    capacity: 1,
    description: 'A standard bomb bag',
    stats: {...bombProps},
    use: (entity) => ({
      type: 'place-bomb',
      cost: 1,
      bomb: bomb({...bombProps, position: entity.position})
    })
  })
}