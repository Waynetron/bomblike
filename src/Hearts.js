import React from 'react';
import styled from 'styled-components'
import Entity from './entity/Entity';
import { findPlayer, makeEntity } from './entity/entities';
import { CELL_SIZE, MAP_WIDTH, MAP_HEIGHT } from './constants';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: .5rem;
`

const ItemContainer = styled.div`
  height: ${CELL_SIZE}px;
  width: ${CELL_SIZE}px;
  p {
    font-size: 1.6rem;
    font-weight: 400;
    margin-top: 0rem;
  }
`

const getHearts = (player) => {
  if (!player) return [];
  
  const hearts = [];
  const position = {x: 0, y: 0};

  for (let i = 0; i < player.health; i ++) {
    hearts.push(makeEntity({
      position, char: '♥'
    }));
  }

  return hearts;
}

const Hearts = ({ entities, hoverStart }) => {
  const player = findPlayer(entities);
  const hearts = getHearts(player);

  return (
    <Container>
      {hearts.map(entity =>
        <ItemContainer>
          <Entity
            entity={entity}
            key={entity.id}
          />
        </ItemContainer>
      )}
    </Container>
  )
}

export default Hearts;