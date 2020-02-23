import React from 'react';
import { motion } from "framer-motion"
import Cell from './Cell';
import { CELL_SIZE, MAP_WIDTH, MAP_HEIGHT } from './constants';

const mapStyle = {
  width: MAP_WIDTH * CELL_SIZE,
  height: MAP_HEIGHT * CELL_SIZE,
  fontSize: `${CELL_SIZE / 15}rem`,
};

const Map = ({entities}) => {
  return (
    <div style={mapStyle}>
      {Object.values(entities).map(({id, char, position, solid, status}) =>
        <Cell
          key={id}
          char={char}
          position={position}
          solid={solid}
          status={status}
        />
      )}
    </div>
  )
}

export default Map;