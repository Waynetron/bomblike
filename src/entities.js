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
}

export const staircase = (props, upOrDown = 'down') => {
  return makeEntity({
    char: upOrDown ? '<' : '>',
    health: 999,
    ...props,
  })
}