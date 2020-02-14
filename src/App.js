import React, { useState } from 'react';
import './App.css';

const CELL_SIZE = 30;

const emptyRoom = [
  ['#','#','#','#','#','#','#','#'],
  ['#','.','.','.','.','.','.','#'],
  ['#','.','.','.','.','.','.','#'],
  ['#','.','.','.','.','.','.','#'],
  ['#','.','.','.','.','.','.','#'],
  ['#','.','.','.','.','.','.','#'],
  ['#','.','.','.','.','.','.','#'],
  ['#','#','#','#','#','#','#','#'],
];

const cellStyle = (x, y, char) => {
  return {
    position: 'relative',
    left: x * CELL_SIZE,
    top: y * CELL_SIZE,
    width: 0,
    height: 0,
  }
};

const cellInnerStyle = (x, y, char) => {
  const charColourMap = {
    ['#']: '#AAA',
    ['.']: '#333'
  };

  return {
  width: CELL_SIZE,
  height: CELL_SIZE,
  color: charColourMap[char] || '#AAA',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  
}};

const mapStyle = (map) => ({
  width: map.length * CELL_SIZE,
  height: map[0].length * CELL_SIZE
});

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

  const addPlayer = (map) => {
    map[1][1] = '@';
    return map;
  }
  
  const [player, setPlayer] = useState({position: {x: 1, y: 1}})
  const [map, setMap] = useState(addPlayer(emptyRoom))
  return (
    <div className="app">
      <div
        className="map"
        style={mapStyle(map)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {map.map((row, y) =>
          row.map((char, x) =>
            <div className="cell" style={cellStyle(x, y, char)}>
              <div style={cellInnerStyle(x, y, char)}>
                <p>{char}</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
