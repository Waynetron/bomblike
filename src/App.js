import React, { useState } from 'react';
import Map from './Map';
import { MAP_WIDTH, MAP_HEIGHT } from './constants';
import { isEqual } from 'lodash';
import './App.css';

let _id = 0;
const makeId = ()=> _id++;

const isAdjacentEdge = (x, y) =>
  x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1;

const makeTile = (position, char = '.', props) => {
  return {
    id: makeId(),
    char,
    position,
    facing: 'right',
    alive: true,
    actions: [],
    ...props,
  }
} 

const makeRoom = () => {
  const tiles = {};
  for (let x = 0; x < MAP_WIDTH; x += 1) {
    for (let y = 0; y < MAP_HEIGHT; y += 1) {
      let char, solid;
      if (isAdjacentEdge(x, y)) {
        char = '#';
        solid = true;
      }
      else {
        char = '.';
        solid = false;
      }

      const tile = makeTile({x, y}, char, {solid})

      tiles[tile.id] = tile;
    }  
  }

  return tiles;
}

const getKey = (position) => `${position.x},${position.y}`;

const getTilesAt = (position, tiles) =>
  Object.values(tiles).filter(tile => isEqual(tile.position, position));

const initialPlayer = makeTile({x: 1, y: 1}, '@', {solid: true});
const playerId = initialPlayer.id;

const generateLevel = (player) => {
  const emptyRoom = makeRoom();
  const enemy = makeTile(
    {x: 9, y: 9},
    'G',
    {
      solid: true,
      facing: 'up',
      actions: [{type: 'move', direction: {x: 0, y: -1}, lifespan: 3}]
    }
  );

  return {
      ...emptyRoom,
      [initialPlayer.id]: initialPlayer,
      [enemy.id]: enemy
  };
}

function App() {
  const [tiles, setTiles] = useState(generateLevel(initialPlayer));

  const move = (tile, direction) => {
    console.log(tile.char, direction);
    const newPosition = {
      x: tile.position.x + direction.x,
      y: tile.position.y + direction.y
    }

    // Check if anything is in the way
    const upcomingTiles = getTilesAt(newPosition, tiles);
    if (Object.values(upcomingTiles).filter(upcoming => upcoming.solid).length > 0) {
      return;
    }


    const newTile = {...tile};
    newTile.position = newPosition

    tiles[tile.id] = newTile;
  }

  const keyToDirection = (key) => {
    const mapping = {
      ArrowUp: {x: 0, y: -1},
      ArrowDown: {x: 0, y: 1},
      ArrowLeft: {x: -1, y: 0},
      ArrowRight: {x: 1, y: 0}
    }

    return mapping[key];
  }

  const performTurn = () => {
    // Perform actions
    for (const tile of Object.values(tiles)) {
      for (const action of tile.actions) {
        if (action.type === 'move') {
          move(tile, action.direction);
        }
      }
    }

    // Clear actions
    for (const tile of Object.values(tiles)) {
      // Reduce action lifespan
      tile.actions.map(action => {
        if (action.lifespan > 0) {
          action.lifespan -= 1
        };
        return action;
      })

      // Remove actions that have exactly 0 lifespan (-1 will live forever)
      tile.actions = tile.actions.filter(action => action.lifespan !== 0);
    }

    setTiles({...tiles});
  }
  
  const handleKeyDown = ({key}) => {
    const direction = keyToDirection(key);
    const wait = key === 'Space';

    if (direction) {
      tiles[playerId].actions.push({type: 'move', direction, lifespan: 1})
    }

    if (direction || wait) {
      performTurn();
    }
  }
  
  return (
    <div className="app" tabIndex={0} onKeyDown={handleKeyDown}>
      <Map tiles={tiles} />
    </div>
  );
}

export default App;
