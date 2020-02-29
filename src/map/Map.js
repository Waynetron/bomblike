import React from 'react';
import styled from 'styled-components'
import Entity from '../entity/Entity';
import { CELL_SIZE, MAP_WIDTH, MAP_HEIGHT } from '../constants';

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
      {Object.values(entities).map(({id, char, position, solid, facing, status, health}) =>
        <Entity
          key={id}
          char={char}
          position={position}
          solid={solid}
          facing={facing}
          status={status}
          health={health}
        />
      )}
    </MapContainer>
  )
}

export default Map;