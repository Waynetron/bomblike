import React from 'react';
import { motion } from "framer-motion"
import { CELL_SIZE } from './constants';
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  width: 0;
  height: 0;
  font-weight: 600;
  left: ${props => props.x * CELL_SIZE}px;
  top: ${props => props.y * CELL_SIZE}px;
  z-index: ${props => props.solid ? 2 : 1};
`;

const Inner = styled.div`
  width: CELL_SIZE;
  height: CELL_SIZE;
  background-color: indianred;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${props => props.solid ? 100 : 10}%;

  p {
    display: inline;
    margin-block-start: 0;
    margin-block-end: 0;
    color: #FFE4C4;
  }

  @keyframes bump {
    0% {
      transform: translate(0px, 0px);
    }
    10% {
      transform: translate(
        ${props => props.bumpOffset.x * 5}px,
        ${props => props.bumpOffset.y * 5}px
      );
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  animation-name: ${props => props.status.attacking ? 'bump' : undefined};
  animation-duration: 0.4s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
`

const Cell = ({char, position: {x, y}, solid, status}) => {
  const bumpOffset = status.attacking || {x: 0, y: 0};
  return (
    <Container x={x} y={y} solid={solid}>
      <Inner solid={solid} status={status} bumpOffset={bumpOffset}>
        <p>{char}</p>
      </Inner>
    </Container>
  )
}

export default Cell;