import React from 'react';
import styled from 'styled-components'

const HugeText = styled.p`
    font-size: 15rem;
    color: beige;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 3rem;
  }
  .player {
    color: #fffa03;
  }
`

const WinGraphic = () => {
  return <HugeText>
    <span className="player">@</span>!
  </HugeText>
}

export default WinGraphic;