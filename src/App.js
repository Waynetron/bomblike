import React, { useState, useEffect, useCallback } from 'react';
import { AppContainer, MapAndInfoContainer, MenuContainer } from './containers';
import Map from './map/Map';
import Info from './Info';
import WinGraphic from './WinGraphic';
import { generateLevel } from './map/map-generation';
import { player } from './entity/entities';
import { findPlayer, canEnterStairs, pickUpWeapon, findWeaponAt } from './entity/entity-util';
import { performTurns, move } from './turn';
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
    const { key } = event;
    const direction = keyToDirection(key);
    const primary = key.toLowerCase() === 'x';
    const wait = key.toLowerCase() === 'z';
    const restart = key.toLowerCase() === 'r'

    if (level === MENU && (primary || wait)) {
      startGame();
      return;
    }

    if ((win || lose) && (primary || wait)) {
      backToTitle();
      return;
    }

    if (restart) {
      startGame();
      return;
    }

    if (!player) {
      return;
    }

    if (direction) {
      move(player, entities, direction);

      // prevent browser from scrolling up or down
      event.preventDefault();
    }

    if (primary) {
      const weapon = findWeaponAt(player.position, entities);
      if (weapon) {
        pickUpWeapon(player, weapon, entities);
      }
      else if (canEnterStairs(player, entities)) {
        nextLevel(player);
        return;
      }
      else {
        const numBombsOut = entities
          .filter(entity => entity.char === 'b' && entity.owner.char === '@')
          .length;
        
        if (numBombsOut < player.weapon.capacity) {
          const action = player.weapon.use(player);
          player.actions.push(action);
        }
      }
    }

    if (direction || wait || primary) {
      const { newEntities, newEvents } = performTurns(entities);

      // Update state
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
