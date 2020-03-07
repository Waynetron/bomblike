import { explodeOnDeath, attackSelf, pickUpWeapons, pickUpConsumables } from '../entity/behaviours';
import { starterBombBag } from './weapons';

let _id = 0;
const makeId = ()=> _id++;

export const makeEntity = (props) => {
  if (!props.position) console.error('entity was created without a position', props);
  if (props.id) console.error('Entity should probably not have a custom ID');

  return {
    id: makeId(),
    name: 'thing',
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
    visible: true,
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
    name: 'player',
    solid: false,
    health: 1,
    behaviours: [],
    description: "It's you, the player",
    weapon: starterBombBag(1),
    armour: null,
    ...props,
  })
};

export const bomb = (props) => {
  return makeEntity({
    char: 'b',
    name: 'bomb',
    solid: true,
    behaviours: [explodeOnDeath],
    description: "It's a bomb, and it's going to explode!",
    health: 3,
    power: 1,
    radius: 1,
    ...props,
  })
};

export const hole = (props) => {
  return makeEntity({
    char: '❒',
    name: 'hole',
    solid: true,
    description: "A hole in the ground",
    health: 999,
    ...props,
  })
};

export const flame = (props) => {
  return makeEntity({
    char: '*',
    name: 'flame',
    solid: false,
    behaviours: [attackSelf],
    health: 1,
    ...props,
  })
};

export const trail = (props) => {
  return makeEntity({
    char: '·',
    name: 'trail',
    solid: false,
    behaviours: [attackSelf],
    health: 3,
    ...props,
  })
};

export const staircase = (props, upOrDown = 'down') => {
  return makeEntity({
    char: upOrDown === 'down' ? '>' : '<',
    name:'staircase',
    health: 999,
    description: "You see a staircase leading down",
    ...props,
  })
};

export const wall = (props, breakable = true) => {
  return makeEntity({
    char: breakable ? '+' : '#',
    name: 'breakable wall',
    health: breakable ? 1 : 999,
    solid: true,
    description: `You see a wall. ${!breakable ? 'It seems unbreakable.' : ''}`,
    ...props,
  })
};