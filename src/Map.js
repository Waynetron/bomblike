import React from 'react';
import styled, {css} from 'styled-components'
import { motion } from "framer-motion"
import Cell from './Cell';
import { CELL_SIZE, MAP_WIDTH, MAP_HEIGHT } from './constants';

const MapContainer = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  font-size: ${CELL_SIZE / 15}rem;
`

const Map = ({entities}) => {
  return (
    <MapContainer
      width={MAP_WIDTH * CELL_SIZE}
      height={MAP_HEIGHT * CELL_SIZE}
    >
      {Object.values(entities).map(({id, char, position, solid, facing, status}) =>
        <Cell
          key={id}
          char={char}
          position={position}
          solid={solid}
          facing={facing}
          status={status}
        />
      )}
    </MapContainer>
  )
}

export default Map;