import React from 'react';
import { CELL_SIZE } from '../constants';
import styled from 'styled-components'
import './Entity.css';

const getColour = (char) => {
  const mapping = {
    '@': 'white',
    '#': 'indianred',
    '+': '#FFE4C4',
    '>': 'white',
    '*': 'yellow',
    'b': 'navy',
  }
  
  return mapping[char] || 'white';
}

const getBackgroundColour = (char) => {
  const mapping = {
    '#': '#FFE4C4',
    '+': 'indianred',
  }
  return mapping[char] || 'indianred'
}

const Container = styled.div.attrs(({ x, y, solid, char }) => ({
  style: {
    left: x * CELL_SIZE + 'px',
    top: y * CELL_SIZE + 'px',
    zIndex: solid ? 2 : 1,
    color: getColour(char),
  }
}))`
  position: relative;
  width: 0;
  height: 0;
`;

const Inner = styled.div.attrs(({ char }) => ({
  style: {
    opacity: char !== '·' ? '100%' : '10%',
    width: CELL_SIZE + 'px',
    height: CELL_SIZE + 'px',
    backgroundColor: getBackgroundColour(char),
  }
}))`
  width: CELL_SIZE;
  height: CELL_SIZE;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    display: inline;
    margin-block-start: 0.2rem;
    margin-block-end: 0;
    font-weight: 700;
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

const getDisplayChar = (char) => {
  if (char === '+') {
    return '#';
  }

  if (char === '#') {
    return '#';
  }

  return char;
}

const Cell = ({char, position: {x, y}, solid, status}) => {
  return (
    <Container x={x} y={y} solid={solid} char={char}>
      <Inner char={char} className={getBumpClass(status)}>
        <p>{getDisplayChar(char)}</p>
      </Inner>
    </Container>
  )
}

export default Cell;