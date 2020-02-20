import React from 'react';
import { motion } from "framer-motion"
import { CELL_SIZE, MAP_WIDTH, MAP_HEIGHT } from './constants';
import './App.css';


const cellStyle = (x, y, solid) => {
  return {
    position: 'relative',
    left: x * CELL_SIZE,
    top: y * CELL_SIZE,
    width: 0,
    height: 0,
    zIndex: solid ? 2 : 1,
  }
};

const cellInnerStyle = (x, y, char) => {
  const charColourMap = {
    '@': '#FFE4C4',
    'G': '#FFE4C4',
    '#': '#FFE4C4',
    '·': '#FFE4C433'
  };

  return {
  width: CELL_SIZE,
  height: CELL_SIZE,
  color: charColourMap[char] || '#FFE4C4',
  backgroundColor: 'indianred',
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
      {Object.values(entities).map(({id, char, position: {x, y}, solid}) =>
        <motion.div
          className="cell"
          animate={{
            left: x * CELL_SIZE,
            top: y * CELL_SIZE,
            zIndex: solid ? 2: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 30
          }}
        >
          <div style={cellInnerStyle(x, y, char)}>
            <p>{char}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Map;