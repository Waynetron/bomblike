import React from 'react';
import { CELL_SIZE } from './constants';
import styled from 'styled-components'
import './Cell.css';

const Container = styled.div.attrs(({ x, y, solid }) => ({
  style: {
    left: x * CELL_SIZE + 'px',
    top: y * CELL_SIZE + 'px',
    zIndex: solid ? 2 : 1,
  }
}))`
  position: relative;
  width: 0;
  height: 0;
  font-weight: 600;
`;

const Inner = styled.div.attrs(({ solid }) => ({
  style: {
    opacity: solid ? '100%' : '10%'
  }
}))`
  width: CELL_SIZE;
  height: CELL_SIZE;
  background-color: indianred;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    display: inline;
    margin-block-start: 0;
    margin-block-end: 0;
    color: #FFE4C4;
  }
`;

const getBumpClass = (status)=> {
  if (status.attacking) {
    const {x, y} = status.attacking;
    if (x < 0) {
      return 'bump-left'
    }
    if (x > 0) {
      return 'bump-right'
    }
    if (y < 0) {
      return 'bump-up'
    }
    if (y > 0) {
      return 'bump-down'
    }
  }

  return '';
}

const Cell = ({char, position: {x, y}, solid, status}) => {
  return (
    <Container x={x} y={y} solid={solid}>
      <Inner solid={solid} className={getBumpClass(status)}>
        <p>{char}</p>
      </Inner>
    </Container>
  )
}

export default Cell;