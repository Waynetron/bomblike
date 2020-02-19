// Behaviours are used at the start of a turn to generate a set of actions

export const walkInALine = (entity, entities) => {
  const { facing } = entity;
  return [{type: 'move', direction: facing}]
}

export const faceAwayFromSolid = (entity, entities) => {
  const { facing } = entity;

  return [{}];
}