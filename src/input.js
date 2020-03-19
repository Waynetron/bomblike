import { findPlayer, findWeaponAt } from './entity/entity-util';

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

export const processInput = (input, entities) => {
  const player = findPlayer(entities);
  const newActions = [];

  if (input.type === 'direction') {
    const action = {type: 'move', direction: input.direction, cost: 1};
    newActions.push(action);
  }

  if (input.type === 'primary') {
    const weapon = findWeaponAt(player.position, entities);
    if (weapon) {
      const action = {type: 'pick-up', entity: player, target: weapon, cost: 1}
      newActions.push(action);
    }
    else {
      const actions = player.weapon.use(player, entities);
      newActions.push(...actions);
    }
  }

  return newActions;
}