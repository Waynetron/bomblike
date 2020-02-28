import React, { useState } from 'react';
import { MapContainer, MenuContainer, Overlay } from './containers';
import Map from './map/Map';
import { generateLevel } from './map/map-generation';
import { player, findPlayer } from './entity/entities';
import { performTurns } from './turn';
import './App.css';

function App() {
  const [entities, setEntities] = useState(generateLevel(player()));
  const [level, setLevel] = useState(0);
  const [events, setEvents] = useState({});

  const startGame = () => {
    setLevel(1);
    setEntities(generateLevel(player()));
  }

  const backToTitle = () => {
    setLevel(0);
    setEntities(generateLevel(player()));
  }

  const nextLevel = (player) => {
    setLevel(level + 1);
    const nextLevel = generateLevel(player);
    setEntities(nextLevel);
  }

  const keyToDirection = (key) => {
    const mapping = {
      ArrowUp: {x: 0, y: -1},
      ArrowDown: {x: 0, y: 1},
      ArrowLeft: {x: -1, y: 0},
      ArrowRight: {x: 1, y: 0}
    }

    return mapping[key];
  }

  const handleKeyDown = ({key}) => {
    const player = findPlayer(entities);
    if (!player) {
      return;
    }

    const direction = keyToDirection(key);
    const wait = key === ' ';
    const restart = key === 'r'

    if (direction) {
      player.actions.push({type: 'move', direction, cost: 1})
    }

    if (direction || wait) {
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
      window.location.reload();
    }
  }

  // Title screen
  if (level === 0) {
    return (
      <MenuContainer>
        <h1>react like</h1>
        <button onClick={startGame}>play</button>
      </MenuContainer>
    )
  }

  const lose = !findPlayer(entities);
  const win = level === 2;
  return (
    // Main game screen
    <MapContainer className={'app-container'} shake={events.shake === true} tabIndex={0} onKeyDown={handleKeyDown} autofocus="true">
      {(win || lose) && (
        <Overlay>
          <h2>{win ? 'Success!' : 'You died'}</h2>
          <button onClick={backToTitle}>Back to title</button>
        </Overlay>
      )}
      <Map entities={entities} />
    </MapContainer>
  );
}

export default App;
