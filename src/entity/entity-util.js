import { getEntitiesAt } from '../map/map-util';
import { remove } from 'lodash';

export const findPlayer = entities => entities.find(entity => entity.char === '@');

export const canEnterStairs = (player, entities) => {
  const collidingEntities = getEntitiesAt(player.position, entities);  
  const stairs = collidingEntities.find(entity => entity.char === '>');

  return Boolean(stairs);
}

export const findWeaponAt = (position, entities) => {
  const collidingEntities = getEntitiesAt(position, entities);  
  return collidingEntities.find(entity => entity.type === 'weapon');
}

export const pickUpWeapon = (player, weapon, entities) => {      
    player.weapon = weapon;
    remove(entities, entity => entity.id === weapon.id);
}