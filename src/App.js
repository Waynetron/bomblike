import React, { useState } from 'react';
import Map from './Map';
import { MAP_WIDTH, MAP_HEIGHT } from './constants';
import './App.css';

let _id = 0;
const makeId = ()=> _id++;

const isAdjacentEdge = (x, y) =>
  x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1;

const makeTile = (position, char = '.') => {
  return {
    id: makeId(),
    char,
    position,
  }
} 

const makeRoom = () => {
  const tiles = {};
  for (let x = 0; x < MAP_WIDTH; x += 1) {
    for (let y = 0; y < MAP_HEIGHT; y += 1) {
      const char = isAdjacentEdge(x, y) ? '#' : '.';
      const tile = makeTile({x, y}, char)

      tiles[tile.id] = tile;
    }  
  }

  return tiles;
}

const getKey = (position) => `${position.x},${position.y}`;

const addTile = (tile, tiles) => {
  const newTiles = {...tiles};
  newTiles[getKey(tile)] = tile;
  return newTiles;
}

const initialPlayer = makeTile({x: 1, y: 1}, '@');
const playerId = initialPlayer.id;

function App() {
  const [tiles, setTiles] = useState({
    ...makeRoom(),
    [initialPlayer.id]: initialPlayer
  });

  const move = (tile, direction) => {
    const newTile = {...tile};
    newTile.position = {
      x: tile.position.x + direction.x,
      y: tile.position.y + direction.y
    }

    tiles[tile.id] = newTile;
    setTiles({...tiles});
  }
  
  const handleKeyDown = ({key}) => {
    const directionMappings = {
      ArrowUp: {x: 0, y: -1},
      ArrowDown: {x: 0, y: 1},
      ArrowLeft: {x: -1, y: 0},
      ArrowRight: {x: 1, y: 0}
    }
  
    if (directionMappings[key]) {
      move(tiles[playerId], directionMappings[key]);
    }
  }
  
  return (
    <div className="app" tabIndex={0} onKeyDown={handleKeyDown}>
      <Map tiles={tiles} />
    </div>
  );
}

export default App;
