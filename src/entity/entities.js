import { traverseStairs, explodeOnDeath, attackSelf, pickUpWeapons } from '../entity/behaviours';
import { starterBombBag } from './weapons';

let _id = 0;
const makeId = ()=> _id++;

export const makeEntity = (props) => {
  if (!props.position) console.error('entity was created without a position', props);
  if (props.id) console.error('Entity should probably not have a custom ID');

  return {
    id: makeId(),
    char: '?',
    weapon: null,
    facing: {x: 0, y: 1},
    alive: true,
    solid: false,
    behaviours: [],
    actions: [],
    actionsPerTurn: 1,
    status: {},
    health: 1,
    description: '',
    ...props,
  }
};

export const findPlayer = entities => entities.find(entity => entity.char === '@');

export const empty = (props) => {
  return makeEntity({
    char: '·',
    solid: false,
    ...props,
  });
}

export const player = (props) => {
  return makeEntity({
    char: '@',
    solid: false,
    health: 1,
    behaviours: [traverseStairs, pickUpWeapons],
    description: "It's you, the player",
    weapon: starterBombBag(1),
    ...props,
  })
};

export const bomb = (props) => {
  return makeEntity({
    char: 'b',
    solid: true,
    behaviours: [explodeOnDeath],
    description: "You see a bomb. It is set to go off",
    health: 3,
    power: 1,
    radius: 1,
    speed: 'full',
    ...props,
  })
};

export const flame = (props) => {
  return makeEntity({
    char: '*',
    solid: false,
    behaviours: [attackSelf],
    health: 1,
    ...props,
  })
};

export const staircase = (props, upOrDown = 'down') => {
  return makeEntity({
    char: upOrDown === 'down' ? '>' : '<',
    health: 999,
    description: "You see a staircase leading down",
    ...props,
  })
};

export const wall = (props, breakable = true) => {
  return makeEntity({
    char: breakable ? '+' : '#',
    health: breakable ? 1 : 999,
    solid: true,
    description: `You see a wall. ${!breakable ? 'It seems unbreakable.' : ''}`,
    ...props,
  })
};