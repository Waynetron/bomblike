import React, { useState, useEffect, useCallback } from 'react';
import { AppContainer, MapContainer, MenuContainer, Overlay } from './containers';
import Map from './map/Map';
import { getEntitiesAt } from './map/map-util';
import { generateLevel } from './map/map-generation';
import { player, findPlayer } from './entity/entities';
import { performTurns, move } from './turn';
import { remove } from 'lodash';
import './App.css';

const NUM_LEVELS = 5;

const initialLevel = 1;
const initialPlayer = player({position: {x: 1, y: 1}});
const initialEntities = generateLevel(initialLevel, {...initialPlayer})

function App() {
  const [level, setLevel] = useState(initialLevel);
  const [entities, setEntities] = useState(initialEntities);
  const [events, setEvents] = useState({});
  const lose = !findPlayer(entities);
  const win = level > NUM_LEVELS;

  const startGame = () => {
    setLevel(1);
    setEntities(generateLevel(1, {...initialPlayer}));
  }

  const backToTitle = useCallback(() => {
    setLevel(0);
    setEntities(generateLevel(level, {...initialPlayer}));
  }, [level]);

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

  const pickUpWeapon = (player, entities) => {
    const collidingEntities = getEntitiesAt(player.position, entities);  
      const weapon = collidingEntities.find(entity => entity.type === 'weapon');
      if (!weapon) {
        return false;
      }

      // pick up the weapon
      player.weapon = weapon;
      remove(entities, entity => entity.id === weapon.id);
      return true;
  }

  const canEnterStairs = (player, entities) => {
    const collidingEntities = getEntitiesAt(player.position, entities);  
    const stairs = collidingEntities.find(entity => entity.char === '>');

    return Boolean(stairs);
  }

  const handleKeyDown = useCallback(event => {
    const player = findPlayer(entities);
    const { key } = event;
    const direction = keyToDirection(key);
    const primary = key.toLowerCase() === 'x';
    const wait = key.toLowerCase() === 'z';
    const restart = key.toLowerCase() === 'r'

    if (level === 0 && (primary || wait)) {
      startGame();
      return;
    }

    if ((win || lose) && (primary || wait)) {
      backToTitle();
      return;
    }

    if (!player) {
      return;
    }

    if (direction) {
      move(player, entities, direction);
      // player.actions.push({type: 'move', direction, cost: 1})
    }

    if (primary) {
      if (pickUpWeapon(player, entities)) {
        // weapon was picked up inside pickUpWeapon
      }
      else if (canEnterStairs(player, entities)) {
        const action = {type: 'change-level', value: 1, cost: 0};
        player.actions.push(action);
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

      // Apply certain events now
      // Others like screenshake will react to props change after setEvents is called
      if (newEvents.changeLevel) {
        nextLevel(player);
      }
    }

    if (restart) {
      startGame();
    }
  }, [entities, nextLevel, backToTitle, level, lose, win]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <AppContainer>
      {level === 0 ?
        // Title screen
        <MenuContainer>
          <h1>bomblike</h1>
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
          <Map entities={entities.filter(e => e.visible)} />
        </MapContainer>
      }
    </AppContainer>
  );
}

export default App;
