import React, { useState, useEffect, useCallback } from 'react';
import { AppContainer, MapAndInfoContainer, MenuContainer } from './containers';
import Map from './map/Map';
import Info from './Info';
import WinGraphic from './WinGraphic';
import { generateLevel } from './map/map-generation';
import { player } from './entity/entities';
import { findPlayer, canEnterStairs } from './entity/entity-util';
import { performTurns } from './turn';
import { getInput, processInput } from './input';
import './App.css';
import './fonts/fonts.css';

const NUM_LEVELS = 5;
const MENU = 0;

function App() {
  const [level, setLevel] = useState(MENU);
  const [entities, setEntities] = useState([]);
  const [events, setEvents] = useState({});
  const [hovered, setHovered] = useState({});
  const lose = entities.length && !findPlayer(entities);
  const win = level > NUM_LEVELS;

  const hoverStart = (entity) => {
    setHovered(entity);
  }

  const hoverStop = () => {
    setHovered(null);
  }

  const startGame = () => {
    setLevel(1);
    setEntities(generateLevel(1, {...player({position: {x: 1, y: 1}})}));
  }

  const backToTitle = useCallback(() => {
    setLevel(MENU);
    setEntities([]);
  }, []);

  const nextLevel = useCallback(player => {
    setLevel(level + 1);
    if (level < NUM_LEVELS) {
      setEntities(generateLevel(level + 1, player));
    }
  }, [level]);

  const handleKeyDown = useCallback(event => {
    const player = findPlayer(entities);
    const { key } = event;
    const input = getInput(key);

    // prevent browser from scrolling up or down when used in an iframe on the itch.io page
    if (input.type === 'direction') {
      event.preventDefault();
    }

    if (level === MENU && input.type === 'primary') {
      startGame();
      return;
    }

    if ((win || lose) && input.type === 'primary') {
      backToTitle();
      return;
    }

    if (input.type === 'restart') {
      startGame();
      return;
    }

    if (input.type === 'primary' && canEnterStairs(player, entities)) {
      nextLevel(player);
      return;
    }

    if (!player) {
      return;
    }

    if (input.type === 'direction' || input.type === 'wait' || input.type === 'primary') {
      // generate player actions from the current input
      const inputActions = processInput(input, entities);
      player.actions.push(...inputActions);

      // perform state changes based on entity behaviours and actions
      const { newEntities, newEvents } = performTurns(input, entities);
      setEntities(newEntities);
      setEvents(newEvents);
    }
  }, [entities, nextLevel, backToTitle, level, lose, win]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <AppContainer win={win} lose={lose}>
      {level === MENU ?
        // Title screen
        <MenuContainer>
          <h1>bomblike</h1>
          <button onClick={startGame}>play <span className={'key'}>(x)</span></button>
        </MenuContainer>
      :
        // Main game screen
        <MapAndInfoContainer
          className={'map-container'}
          shake={events.shake === true}
        >
          {win
            ?
              <WinGraphic />
            :
              <Map
                entities={entities.filter(e => e.visible)}
                hoverStart={hoverStart}
                hoverEnd={hoverStop}
              />}
          <Info
            entities={entities}
            hovered={hovered}
            win={win}
            lose={lose}
            events={events}
          />
        </MapAndInfoContainer>
      }
    </AppContainer>
  );
}

export default App;
