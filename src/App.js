import React, { useState } from 'react';
import Map from './Map';
import { MAP_WIDTH, MAP_HEIGHT } from './constants';
import './App.css';

let _id = 0;
const makeId = ()=> _id++;

const isAdjacentEdge = (x, y) =>
  x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1;

const makeRoom = () => {
  const tiles = {};
  for (let x = 0; x < MAP_WIDTH; x += 1) {
    for (let y = 0; y < MAP_HEIGHT; y += 1) {
      const char = isAdjacentEdge(x, y) ? '#' : '.';
      const id = makeId();
      const tile = {
        id,
        char,
        position: {x, y},
      }

      tiles[id] = tile;
    }  
  }

  return tiles;
}

function App() {
  const move = ({x, y}) => {
    console.log(x, y);
  }
  
  const handleKeyDown = ({key}) => {
    const directionMappings = {
      ArrowUp: {x: 0, y: -1},
      ArrowDown: {x: 0, y: 1},
      ArrowLeft: {x: -1, y: 0},
      ArrowRight: {x: 1, y: 0}
    }
  
    if (directionMappings[key]) {
      move(directionMappings[key]);
    }
  }
  
  const [player, setPlayer] = useState({position: {x: 1, y: 1}})
  const [tiles, setTiles] = useState(makeRoom())
  return (
    <div className="app" tabIndex={0} onKeyDown={handleKeyDown}>
      <Map tiles={tiles} />
    </div>
  );
}

export default App;
