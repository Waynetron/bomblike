const keyToDirection = (key) => {
  const mapping = {
    ArrowUp: {x: 0, y: -1},
    ArrowDown: {x: 0, y: 1},
    ArrowLeft: {x: -1, y: 0},
    ArrowRight: {x: 1, y: 0}
  }

  return mapping[key];
}

export const getInput = key => {
  const direction = keyToDirection(key);
  if (direction) {
    return {type: 'direction', direction } 
  };

  if (key.toLowerCase() === 'x') {
    return {type: 'primary'};
  }

  if (key.toLowerCase() === 'z') {
    return {type: 'wait'};
  }

  if (key.toLowerCase() === 'r') {
    return {type: 'restart'};
  }

  return {type: 'unknown'};
}