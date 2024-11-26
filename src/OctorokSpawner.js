// src/OctorokSpawner.js
import React, { useState, useEffect } from 'react';
import OctorokComponent from './OctorokComponent';

const OctorokSpawner = ({ gameWidth, gameHeight, playerPosition, isPlayerAttacking, swordRef, swordPosition }) => {
    const [octoroks, setOctoroks] = useState([]);
    const maxOctoroks = 10;

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'p') {
                spawnOctorok();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [octoroks]);

    const spawnOctorok = () => {
        const availableOctorok = octoroks.find(octorok => !octorok.isActive);
        if (availableOctorok) {
            availableOctorok.isActive = true;
            availableOctorok.position = {
                x: Math.random() * (gameWidth - 30),
                y: Math.random() * (gameHeight - 30)
            };
            setOctoroks([...octoroks]);
        } else if (octoroks.length < maxOctoroks) {
            const newOctorok = {
                id: Date.now(),
                isActive: true,
                position: {
                    x: Math.random() * (gameWidth - 30),
                    y: Math.random() * (gameHeight - 30)
                }
            };
            setOctoroks([...octoroks, newOctorok]);
        }
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
                    isActive={octorok.isActive}
                    onDeath={() => {
                        octorok.isActive = false;
                        setOctoroks([...octoroks]);
                    }}
                />
            ))}
        </>
    );
};

export default OctorokSpawner;
