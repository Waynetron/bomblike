import { traverseStairs, walkInALine, faceWalkable, attackAdjacentPlayerAndDie, explodeOnDeath, attackSelf } from '../entity/behaviours';

let _id = 0;
const makeId = ()=> _id++;

export const makeEntity = (props) => {
  if (props.id) console.error('Entity should probably not have a custom ID');

  return {
    id: makeId(),
    char: '?',
    facing: {x: 0, y: 0},
    alive: true,
    solid: false,
    behaviours: [],
    actions: [],
    actionsPerTurn: 1,
    status: {},
    health: 1,
    ...props,
  }
};

export const findPlayer = entities => Object.values(entities).find(entity => entity.char === '@');

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
    solid: true,
    health: 1,
    behaviours: [traverseStairs],
    ...props,
  })
};

export const bomb = (props) => {
  return makeEntity({
    char: 'b',
    solid: true,
    behaviours: [explodeOnDeath],
    health: 5,
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

export const goblin = (props) => {
  return makeEntity({
    char: 'G',
    solid: true,
    behaviours: [walkInALine, faceWalkable, attackAdjacentPlayerAndDie],
    ...props,
  })
};

export const staircase = (props, upOrDown = 'down') => {
  return makeEntity({
    char: upOrDown === 'down' ? '>' : '<',
    health: 999,
    ...props,
  })
};

export const wall = (props, breakable = true) => {
  return makeEntity({
    char: breakable ? '+' : '#',
    health: breakable ? 1 : 999,
    solid: true,
    ...props,
  })
};