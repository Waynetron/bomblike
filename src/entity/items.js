import { makeEntity, bomb, flame } from './entities';
import { shuffle } from '../math';

export const armour = (props) => {
  const armour = makeEntity({
    char: '⍚',
    solid: false,
    health: 999,
    description: "The armour is very old, but still good",
    defense: 1,
    ...props,
  });

  return armour;
}

export const stopWatch = (props) => {
  const watch = makeEntity({
    char: '⌚︎',
    solid: false,
    health: 999,
    description: "It's a Casio! Press <c> to slow time",
    ...props,
  });

  return watch;
}

const items = [armour];

export const getRandomItem = () => {
  const shuffled = shuffle(items);
  const item = shuffled[0];
  
  return item;
}