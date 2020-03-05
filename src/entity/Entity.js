import React from 'react';
import { CELL_SIZE } from '../constants';
import styled from 'styled-components'
import './Entity.css';

const getColour = (char) => {
  const mapping = {
    '@': '#fffa03',
    '#': 'black',
    '+': 'beige',
    '>': 'yellow',
    '*': 'yellow',
    'b': 'yellow',
    'ó': 'yellow',
    'S': 'white',
    '❒': 'white',
  }
  
  return mapping[char] || 'tomato';
}

const getBackgroundColour = (char) => {
  const mapping = {
    '#': 'beige',
    '+': '#4135ff',
    'S': '#AAAAFF77',
    '❒': 'black',
  }
  return mapping[char] || 'transparent'
}

const getZIndex = (solid, char) => {
  if (char === '❒') {
    return 1;
  }
  if (char === 'S') {
    return 3;
  }
  if (solid || char === 'b') {
    return 2;
  }
  
  return 1;
}

const Container = styled.div.attrs(({ x, y, solid, char }) => ({
  style: {
    left: x * CELL_SIZE + 'px',
    top: y * CELL_SIZE + 'px',
    zIndex: getZIndex(solid, char),
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
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    border: solid 2px white;
    cursor: pointer;
    p {
      color: white;
    }
    background-color: navy;
    opacity: 1;
  }

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

const getShakeClass = (char, health)=> {
  if (char === 'b' && health === 1) {
    return 'shake';
  }

  return '';
}

const getDisplayChar = (char, health) => {

  if (char === '+') {
    return '#';
  }

  if (char === '#') {
    return '#';
  }

  if (char === 'b') {
    return health;
  }

  if (char === '❒') {
    return '';
  }

  return char;
}

const Cell = ({entity, hoverStart}) => {
  const {char, position: {x, y}, solid, status, health} = entity;
  return (
    <Container x={x} y={y} solid={solid} char={char}>
      <Inner
        char={char}
        className={`${getBumpClass(status)} ${getShakeClass(char, health)}`}
        onMouseEnter={() => hoverStart(entity)}
      >
        <p>{getDisplayChar(char, health)}</p>
      </Inner>
    </Container>
  )
}

export default Cell;