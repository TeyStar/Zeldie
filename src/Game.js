// src/Game.js
import React, { useState, useEffect, useRef } from 'react';
import PlayerComponent from './PlayerComponent';
import OctorokComponent from './OctorokComponent';
import OctorokSpawner from './OctorokSpawner';
import './Game.css';

function Game() {
    const [isAttacking, setIsAttacking] = useState(false);
    const [keysPressed, setKeysPressed] = useState({});
    const [playerPosition, setPlayerPosition] = useState({ x: 60, y: 60 });
    const [swordPosition, setSwordPosition] = useState({ x: 0, y: 0 });
    const gameWidth = 480; // Game width
    const gameHeight = 330; // Game height
    const playerSize = 30;
    const playerMoveSpeed = 15;  // Half of the player size is the speed.
    const octorokMoveSpeed = 5;  // Octorok move speed
    const swordRef = useRef(null); // Define swordRef here

    useEffect(() => {
        const handleKeyDown = (event) => {
            setKeysPressed((prevKeys) => ({ ...prevKeys, [event.key]: true }));
        };

        const handleKeyUp = (event) => {
            setKeysPressed((prevKeys) => ({ ...prevKeys, [event.key]: false }));
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const handlePlayerAttack = (position) => {
        setSwordPosition(position);
        setIsAttacking(true);
        setTimeout(() => setIsAttacking(false), 500); // Reset attack state after duration
    };

    return (
        <div className="game" tabIndex="0">
            <PlayerComponent
                gameWidth={gameWidth}
                gameHeight={gameHeight}
                playerSize={playerSize}
                playerMoveSpeed={playerMoveSpeed}
                isAttacking={isAttacking}
                setIsAttacking={setIsAttacking}
                keysPressed={keysPressed}
                onPlayerAttack={handlePlayerAttack} // Pass the attack handler
                swordRef={swordRef} // Pass swordRef to PlayerComponent
            />
            <OctorokComponent
                gameWidth={gameWidth}
                gameHeight={gameHeight}
                playerSize={playerSize}
                octorokMoveSpeed={octorokMoveSpeed}
                playerPosition={playerPosition}
                isPlayerAttacking={isAttacking} // Pass the attack state
                swordRef={swordRef} // Pass swordRef to OctorokComponent
                swordPosition={swordPosition} // Pass swordPosition to OctorokComponent
            />
            <OctorokSpawner
                gameWidth={gameWidth}
                gameHeight={gameHeight}
                playerPosition={playerPosition}
                isPlayerAttacking={isAttacking} // Pass the attack state
                swordRef={swordRef} // Pass swordRef to OctorokSpawner
                swordPosition={swordPosition} // Pass swordPosition to OctorokSpawner
            />
        </div>
    );
}

export default Game;
