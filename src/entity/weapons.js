import { makeEntity, bomb } from './entities';
import { shuffle } from '../math';

const regularBombBehaviour = (entity, entities, bombProps) => {
  const bombsOut = entities.filter(entity => entity.char === 'b' && entity.owner.char === '@');
      
  if (bombsOut.length < entity.weapon.capacity) {
    return [{
      type: 'place-bomb',
      cost: 1,
      bomb: bomb({...bombProps, position: entity.position})
    }]
  }

  // bomb can be remote detonated
  if (bombProps.canRemoteDetonate) {
    const detonateActions = bombsOut.map(bomb => ({
      type: 'attack',
      target: bomb,
      value: bomb.health,
      cost: 0,
    }));
  
    return [...detonateActions, {type: 'wait', cost: 1}];
  }

  return [];
}

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
      // if bomb can be remote detonated
      canRemoteDetonate: bombProps.canRemoteDetonate || false,
    },
    use: (entity, entities) => regularBombBehaviour(entity, entities, bombProps),
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
  const noFuse = {health: 999};
  const remoteDetonator = {canRemoteDetonate: true};
  
  let bagProps = {};
  let bombProps = {};

  const possibleBagTraitCombinations = [
    [veryLargeRadius, longFuse],
    [shortFuse],
    [largeRadius],
    [shortFuse, largeRadius],
    [veryLargeRadius],
    [remoteDetonator, noFuse],
    [remoteDetonator, noFuse, largeRadius],
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