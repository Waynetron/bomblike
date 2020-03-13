import React from 'react';
import styled from 'styled-components'
import { findPlayer } from './entity/entities';
import { CELL_SIZE, MAP_WIDTH } from './map/constants';
import { getEntitiesAt } from './map/map-util';

const InfoBox = styled.div`
  justify-content: start;
  align-content: center;
  flex-direction: column;
  display: flex;
  width: ${props => props.width}px;
  min-height: 7rem;
  
  p {
    text-align: center;
    line-height: 1.5rem;
    font-size: 1.2rem;
    color: white;
    font-weight: 400;
    margin-top: 0.6rem;
    margin-bottom: 0.5rem;
  }
  .key {
    color: #fffa03;
    font-weight: 600;
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
    color: #fffa03;
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

const Stats = ({entity}) => {
  if (!entity || !entity.stats) {
    // returning empty stats container to prevent the height from shifting
    return <StatsContainer><p></p></StatsContainer>;
  }

  const { capacity, power, radius, timer } = entity.stats;

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

const getInfoToDisplay = (hovered, entities, win, lose, events) => {
  const player = findPlayer(entities);
  const entitiesAtPlayer = player ? getEntitiesAt(player.position, entities) : [];
  const stairs = entitiesAtPlayer.find(entity => entity.char === '>');
  const weapon = entitiesAtPlayer.find(entity => entity.type === 'weapon');

  if (!weapon && !stairs && !hovered && !win && !lose) {
    return null;
  }

  const entity = weapon || stairs || hovered;

  if (lose) {
    const killer = events.playerKiller;
    return (
      <>
        <p>You were killed by a <span className="key">{killer ? killer.name : 'something'}</span></p>
        <p>Back to title <span className="key">(x)</span></p>
      </>
    );
  }

  if (win) {
    return (
      <>
        <p>You conquered the dungeon. Way to go!</p>
        <p>Back to title <span className="key">(x)</span></p>
      </>
    );
  }

  // Player sitting over weapon
  if (weapon) {
    return (
      <>
        <Stats entity={entity} />
        <p>take <span className="key">(x)</span></p>
      </>
    );
  }
  // Player sitting over stairs
  else if (stairs) {
    return (
      <>
        <p>{entity.description || ''}</p>
        <p>descend <span className="key">(x)</span></p>
      </>
    );
  }
  // Hovering something with the mouse
  else {
    return (
      <>
        {hovered.stats
          ? <Stats entity={hovered} />
          : <p>{hovered.description || ''}</p>}
      </>
    );
  }
}

const Info = ({hovered, entities, win, lose, events}) => {
  return (
    <InfoBox width={MAP_WIDTH * CELL_SIZE}>
      {getInfoToDisplay(hovered, entities, win, lose, events)}
    </InfoBox>
  )
}

export default Info;