let _id = 0;
const makeId = ()=> _id++;

export const makeTile = (position, char = '.', props) => {
  return {
    id: makeId(),
    char,
    position,
    facing: {x: 1, y: 0},
    alive: true,
    actions: [],
    ...props,
  }
}