let _id = 0;
const makeId = ()=> _id++;

export const makeEntity = (props) => {
  if (props.id) console.error('Entity should probably not have a custom ID');

  return {
    id: makeId(),
    char: '?',
    facing: {x: 1, y: 0},
    alive: true,
    actions: [],
    ...props,
  }
}