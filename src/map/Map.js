import React from 'react';
import styled from 'styled-components'
import Entity from '../entity/Entity';
import { CELL_SIZE, MAP_WIDTH, MAP_HEIGHT } from '../constants';

const MapContainer = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  font-size: ${CELL_SIZE / 16}rem;
  margin-bottom: 1rem;
`

const Map = ({entities, hoverStart, hoverStop}) => {
  return (
    <MapContainer
      width={MAP_WIDTH * CELL_SIZE}
      height={MAP_HEIGHT * CELL_SIZE}
      onMouseLeave={hoverStop}
    >
      {entities.map(entity =>
        <Entity
          entity={entity}
          key={entity.id}
          hoverStart={hoverStart}
        />
      )}
    </MapContainer>
  )
}

export default Map;