import React, { useState, useEffect, useCallback } from 'react';
import { AppContainer, MapContainer, MenuContainer, Overlay } from './containers';
import Map from './map/Map';
import { generateLevel } from './map/map-generation';
import { player, findPlayer } from './entity/entities';
import { performTurns, move } from './turn';
import './App.css';

const NUM_LEVELS = 2;

function App() {
  const [level, setLevel] = useState(1);
  const [entities, setEntities] = useState(generateLevel(level, player()));
  const [events, setEvents] = useState({});

  const startGame = () => {
    setLevel(1);
    setEntities(generateLevel(1, player()));
  }

  const backToTitle = () => {
    setLevel(0);
    setEntities(generateLevel(level, player()));
  }

  const nextLevel = useCallback(player => {
    setLevel(level + 1);
    if (level < NUM_LEVELS) {
      setEntities(generateLevel(level + 1, player));
    }
  }, [level]);

  const keyToDirection = (key) => {
    const mapping = {
      ArrowUp: {x: 0, y: -1},
      ArrowDown: {x: 0, y: 1},
      ArrowLeft: {x: -1, y: 0},
      ArrowRight: {x: 1, y: 0}
    }

    return mapping[key];
  }

  const handleKeyDown = useCallback(event => {
    const player = findPlayer(entities);
    if (!player) {
      return;
    }

    const { key } = event;
    const direction = keyToDirection(key);
    const wait = key === 'z';
    const bomb = key === 'x';
    const restart = key === 'r'

    if (direction) {
      move(player, entities, direction);
      // player.actions.push({type: 'move', direction, cost: 1})
    }

    if (bomb) {
      player.actions.push({type: 'place-bomb', direction, cost: 1})
    }

    if (direction || wait || bomb) {
      const { newEntities, newEvents } = performTurns(entities);

      // Update state
      setEntities(newEntities);
      setEvents(newEvents);

      // Apply certain events now
      // Others like screenshake will react to props change after setEvents is called
      if (newEvents.changeLevel) {
        nextLevel(player);
      }
    }

    if (restart) {
      startGame();
    }
  }, [entities, nextLevel]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const lose = !findPlayer(entities);
  const win = level > NUM_LEVELS;
  return (
    <AppContainer>
      {level === 0 ?
        // Title screen
        <MenuContainer>
          <h1>react like</h1>
          <button onClick={startGame}>play</button>
        </MenuContainer>
      :
        // Main game screen
        <MapContainer className={'map-container'} shake={events.shake === true}>
          {(win || lose) && (
            <Overlay>
              <h2>{win ? 'Success!' : 'You died'}</h2>
              <button onClick={backToTitle}>Back to title</button>
            </Overlay>
          )}
          <Map entities={entities} />
        </MapContainer>
      }
    </AppContainer>
  );
}

export default App;
