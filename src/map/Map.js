import React, { useState } from 'react';
import styled from 'styled-components'
import Entity from '../entity/Entity';
import Hearts from '../Hearts';
import { CELL_SIZE, MAP_WIDTH, MAP_HEIGHT } from '../constants';

const RowLayout = styled.div`
  display: flex;
  flex-direction: column;
`

const ColumnLayout = styled.div`
  display: flex;
  flex-direction: row;
`

const MapContainer = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  font-size: ${CELL_SIZE / 16}rem;
  margin-bottom: 1rem;
`

const InfoBox = styled.div`
  justify-content: center;
  align-content: center;
  flex-direction: column;
  display: flex;
  width: ${props => props.width}px;
  height: 5rem;
  p {
    text-align: center;
    line-height: 1.5rem;
    font-size: 1.2rem;
    color: white;
    font-weight: 400;
    margin-top: 0.6rem;
  }
`

const StatsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  span {
    display: inline-block;
  }
  .trait {
    color: yellow;
    font-weight: 600;
  }
`

const getCapacityText = (capacity)=> {
  const options = ['', 'large', 'plentiful'];
  return options[capacity - 1];
}

const getPowerText = (power)=> {
  const options = [null, 'powerful', 'very powerful', 'dangerously powerful']
  return options[power - 1];
}

const getRadiusText = (radius)=> {
  const options = [null, 'large radius', 'very large radius', 'dangerously large radius'];
  return options[radius - 1];
}

const getTimerText = (timer)=> {
  let text = null;
  if (timer === 2) {
    text = 'short fuse'
  }
  if (timer === 5) {
    text = 'long fuse'
  }
  return text;
}

const Stats = ({hovered}) => {
  if (!hovered || !hovered.stats) {
    // returning empty stats container to prevent the height from shifting
    return <StatsContainer><p></p></StatsContainer>;
  }

  const { capacity, power, radius, timer } = hovered.stats;

  const capacityText = getCapacityText(capacity);
  const powerText = getPowerText(power);
  const radiusText = getRadiusText(radius);
  const timerText = getTimerText(timer);

  return (
  <StatsContainer>
    <p>
      <span>A</span>
      { " " }
      {capacityText && <span className="trait">{capacityText} </span>}
      { " " }
      <span>bomb bag</span>
      { " " }
      {(powerText || radiusText || timerText) && <span>with</span>}
      { " " }
      {powerText && <span className="trait">{powerText} </span>}
      { " " }
      {radiusText && <span className="trait">{radiusText} </span>}
      { " " }
      {timerText && <span className="trait">{timerText} </span>}
      { " " }
      {(powerText || radiusText || timerText) && <span>bombs</span>}
    </p>
  </StatsContainer>
  );
}

const Map = ({entities}) => {
  const [hovered, setHovered] = useState({});
  const hoverStart = (entity) => {
    setHovered(entity);
  }
  const hoverStop = () => {
    setHovered(null);
  }

  const isBombBag = (hovered && hovered.stats);

  return (
    <RowLayout>
    <Hearts entities={entities} hoverStart={hoverStart} />
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
        {!isBombBag && <p>{hovered ? hovered.description : ''}</p>}
        {isBombBag && <Stats hovered={hovered} />}
      </InfoBox>
    </RowLayout>
  )
}

export default Map;