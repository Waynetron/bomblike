import styled, { css } from 'styled-components'

const shake = css`
  @keyframes shake {
    0% {
      background-color: crimson;
    }
    20% {
      transform: translate3d(4px, -4px, 0);
      background-color: crimson;
    } 
    40% {
      transform: translate3d(-4px, 4px, 0);
    }
    60% {
      transform: translate3d(4px, 4px, 0);
    }
    80% {
      transform: translate3d(-4px, -4px, 0);
    }
  }

  animation-duration: 0.2s;
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(.36,.07,.19,.97);
`

const centered = css`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const MapContainer = styled.div`
  ${shake}
  ${centered}
  animation-name: ${props => props.shake ? 'shake' : undefined};
`;

export const MenuContainer = styled.div`
  ${shake}
  ${centered}
  animation-name: 'shake';
  flex-direction: column;
`;

export const Overlay = styled.div`
  ${shake};
  animation-name: 'shake';
`;