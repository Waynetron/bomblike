import { traverseStairs, walkInALine, faceWalkable, attackAdjacentPlayerAndDie } from '../entity/behaviours';

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

export const player = (props) => {
  return makeEntity({
    char: '@',
    position: {x: 1, y: 1},
    solid: true,
    health: 1,
    behaviours: [traverseStairs],
    ...props,
  })
};

export const goblin = (props) => {
  return makeEntity({
    char: 'g',
    solid: true,
    behaviours: [walkInALine, faceWalkable, attackAdjacentPlayerAndDie],
    ...props,
  })
};

export const staircase = (props, upOrDown = 'down') => {
  return makeEntity({
    char: upOrDown ? '<' : '>',
    health: 999,
    ...props,
  })
};

export const wall = (props, breakable = true) => {
  return makeEntity({
    char: breakable ? '%' : '#',
    health: breakable ? 1 : 999,
    solid: true,
    ...props,
  })
};