import React, { useState } from 'react';
import styled from 'styled-components'
import Entity from '../entity/Entity';
import { CELL_SIZE, MAP_WIDTH, MAP_HEIGHT } from '../constants';

const ColumnLayout = styled.div`
  flex-direction: column;
`

const MapContainer = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  font-size: ${CELL_SIZE / 15}rem;
  margin-bottom: 1rem;
`

const InfoBox = styled.div`
  justify-content: center;
  display: flex;
  width: ${props => props.width}px;
  p {
    line-height: 0;
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
  }
`

const Map = ({entities}) => {
  const [hovered, setHovered] = useState({});
  const hoverStart = (entity) => {
    setHovered(entity);
  }
  const hoverStop = () => {
    setHovered(null);
  }

  return (
    <ColumnLayout>
      <MapContainer
        width={MAP_WIDTH * CELL_SIZE}
        height={MAP_HEIGHT * CELL_SIZE}
        onMouseLeave={hoverStop}
      >
        {Object.values(entities).map(entity =>
          <Entity
            entity={entity}
            key={entity.id}
            hoverStart={hoverStart}
          />
        )}
      </MapContainer>
      <InfoBox width={MAP_WIDTH * CELL_SIZE}>
        <p>{hovered ? hovered.description : ''}</p>
      </InfoBox>
    </ColumnLayout>
  )
}

export default Map;