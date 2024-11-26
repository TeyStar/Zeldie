// src/OctorokSpawner.js
import React, { useState, useEffect } from 'react';
import OctorokComponent from './OctorokComponent';

const OctorokSpawner = ({ gameWidth, gameHeight, playerPosition, isPlayerAttacking, swordRef, swordPosition }) => {
    const [octoroks, setOctoroks] = useState([]);
    const maxOctoroks = 3;

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'p' && octoroks.length < maxOctoroks) {
                spawnOctorok();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [octoroks]);

    const spawnOctorok = () => {
        const newOctorok = {
            id: Date.now(),
            position: {
                x: Math.random() * (gameWidth - 30),
                y: Math.random() * (gameHeight - 30)
            }
        };
        setOctoroks([...octoroks, newOctorok]);
    };

    return (
        <>
            {octoroks.map((octorok) => (
                <OctorokComponent
                    key={octorok.id}
                    gameWidth={gameWidth}
                    gameHeight={gameHeight}
                    playerPosition={playerPosition}
                    isPlayerAttacking={isPlayerAttacking}
                    swordRef={swordRef}
                    swordPosition={swordPosition}
                    octorokMoveSpeed={5}
                    initialPosition={octorok.position}
                />
            ))}
        </>
    );
};

export default OctorokSpawner;
