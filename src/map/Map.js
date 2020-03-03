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
  align-content: center;
  flex-direction: column;
  display: flex;
  width: ${props => props.width}px;
  p {
    text-align: center;
    line-height: 0;
    font-size: 1.2rem;
    color: white;
    font-weight: 600;
    margin: 1rem 0.6rem;
  }
`

const StatsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  p {
    font-weight: 300;
  }
`

const Stats = ({hovered}) => {
  if (!hovered || !hovered.stats) {
    // returning empty stats container to prevent the height from shifting
    return <StatsContainer><p></p></StatsContainer>;
  }

  const entries = Object.entries(hovered.stats);
  const statsText = entries.map(([name, stat]) =>
    <p>{name}: {stat}</p>
  );

  return <StatsContainer>{statsText}</StatsContainer>;
}

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
        {entities.map(entity =>
          <Entity
            entity={entity}
            key={entity.id}
            hoverStart={hoverStart}
          />
        )}
      </MapContainer>
      <InfoBox width={MAP_WIDTH * CELL_SIZE}>
        <p>{hovered ? hovered.description : ''}</p>
        <Stats hovered={hovered} />
      </InfoBox>
    </ColumnLayout>
  )
}

export default Map;