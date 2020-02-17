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
  const enemy = makeTile({x: 9, y: 9}, 'G', {solid: true, facing: 'up'});

  return {
      ...emptyRoom,
      [initialPlayer.id]: initialPlayer,
      [enemy.id]: enemy
  };
}

function App() {
  const [tiles, setTiles] = useState(generateLevel(initialPlayer));

  const move = (tile, direction) => {
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
    setTiles({...tiles});
  }

  const keyToDirection = (key) => {
    const mapping = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right'
    }

    return mapping[key];
  };

  const directionToVector = (direction) => {
    const mapping = {
      up: {x: 0, y: -1},
      down: {x: 0, y: 1},
      left: {x: -1, y: 0},
      right: {x: 1, y: 0}
    }

    return mapping[direction];
  }
  
  const handleKeyDown = ({key}) => {
    const direction = keyToDirection(key);
    if (!direction) {
      return;
    }

    const vector = directionToVector(direction);
    move(tiles[playerId], vector);
  }
  
  return (
    <div className="app" tabIndex={0} onKeyDown={handleKeyDown}>
      <Map tiles={tiles} />
    </div>
  );
}

export default App;
