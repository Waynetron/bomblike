// Behaviours are used at the start of a turn to generate a set of actions

export const walkInALine = (tile, map) => {
  const { facing } = tile;
  return {type: 'move', direction: facing}
}

export const faceAwayFromSolid = (tile, map) => {
  const { facing } = tile;

  return {};
}