import styled, { css } from 'styled-components'

const shake = css`
  @keyframes shake {
    20% {
      transform: translate3d(4px, -4px, 0);
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

const grow = css`
  display: flex;
  justify-content: center;
  align-items: center;

  animation-name: grow;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
`

const centered = css`
  display: flex;
  justify-content: center;
  align-items: center;
`

const getBackgroundColor = (win, lose) => {
  if (win) {
    return 'black';
  }
  if (lose) {
    return '#d42a2a';
  }

  return 'black';
}

export const AppContainer = styled.div`
  ${centered}
  background-color: ${({win, lose}) => getBackgroundColor(win, lose)};
  transition: background-color 0.2s cubic-bezier(0,1.56,.52,.99);
  display: flex;
  width: 100%;
  height: 100%;
`;

export const MapAndInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ${shake}
  ${grow}
  animation-name: ${props => props.shake ? 'shake, grow' : undefined};
`;

export const MenuContainer = styled.div`
  ${centered}
  animation-name: 'shake';
  flex-direction: column;
`;
