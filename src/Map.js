import React from 'react';
import { CELL_SIZE, MAP_WIDTH, MAP_HEIGHT } from './constants';
import './App.css';


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

const mapStyle = {
  width: MAP_WIDTH * CELL_SIZE,
  height: MAP_HEIGHT * CELL_SIZE,
};

const Map = ({entities}) => {
  return (
    <div
      className="map"
      style={mapStyle}
    >
      {Object.values(entities).map(({id, char, position: {x, y}}) =>
        <div className="cell" style={cellStyle(x, y, char)}>
          <div style={cellInnerStyle(x, y, char)}>
            <p>{char}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Map;