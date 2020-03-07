import React from 'react';
import styled from 'styled-components'
import Entity from './entity/Entity';
import { findPlayer } from './entity/entities';
import { CELL_SIZE, MAP_WIDTH, MAP_HEIGHT } from './constants';

const InventoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${CELL_SIZE}px;
`

const ItemContainer = styled.div`
  height: ${CELL_SIZE}px;
  width: ${CELL_SIZE}px;
  border: solid 1px yellow;
  p {
    font-size: 1.2rem;
    font-weight: 400;
  }
`

const getInventory = (player) => {
  if (!player) return [];
  
  const inventory = [];
  const position = {x: 0, y: 0};

  if (player.weapon) {
    inventory.push({...player.weapon, position});
  }

  if (player.armour) {
    inventory.push({...player.armour, position});
  }

  return inventory;
}

const Inventory = ({ entities, hoverStart }) => {
  const player = findPlayer(entities);
  const inventory = getInventory(player);

  return (
    <InventoryContainer>
      {inventory.map(entity =>
        <ItemContainer>
          <Entity
            entity={entity}
            key={entity.id}
            hoverStart={hoverStart}
          />
        </ItemContainer>
      )}
    </InventoryContainer>
  )
}

export default Inventory;