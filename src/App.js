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

const addTile = (tile, tiles) => {
  const newTiles = {...tiles};
  newTiles[getKey(tile)] = tile;
  return newTiles;
}

const getTilesAt = (position, tiles) =>
  Object.values(tiles).filter(tile => isEqual(tile.position, position));

const initialPlayer = makeTile({x: 1, y: 1}, '@', {solid: true});
const playerId = initialPlayer.id;

function App() {
  const [tiles, setTiles] = useState({
    ...makeRoom(),
    [initialPlayer.id]: initialPlayer
  });

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
