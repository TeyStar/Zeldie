import React, { useState, useEffect } from 'react';
import Player from './Player';

const PlayerComponent = ({ gameWidth, gameHeight, playerSize, playerMoveSpeed, isAttacking, setIsAttacking, keysPressed, onPlayerAttack, swordRef }) => {
    const [playerPosition, setPlayerPosition] = useState({ x: 60, y: 60 });
    const [facingDirection, setFacingDirection] = useState('down');
    const [swordPosition, setSwordPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updatePlayerPosition = () => {
            if (isAttacking) return; // Prevent movement while attacking

            setPlayerPosition((prevPosition) => {
                let newPosition = { ...prevPosition };
                if (keysPressed['ArrowUp']) {
                    setFacingDirection('up');
                    newPosition.y = Math.max(prevPosition.y - playerMoveSpeed, 0);
                }
                if (keysPressed['ArrowDown']) {
                    setFacingDirection('down');
                    newPosition.y = Math.min(prevPosition.y + playerMoveSpeed, gameHeight - playerSize);
                }
                if (keysPressed['ArrowLeft']) {
                    setFacingDirection('left');
                    newPosition.x = Math.max(prevPosition.x - playerMoveSpeed, 0);
                }
                if (keysPressed['ArrowRight']) {
                    setFacingDirection('right');
                    newPosition.x = Math.min(prevPosition.x + playerMoveSpeed, gameWidth - playerSize);
                }
                return newPosition;
            });
        };

        const handleAttack = () => {
            if (keysPressed[' ']) {
                setIsAttacking(true);
                // Calculate sword position based on facing direction
                let swordX = playerPosition.x;
                let swordY = playerPosition.y;
                if (facingDirection === 'up') swordY -= playerSize;
                if (facingDirection === 'down') swordY += playerSize;
                if (facingDirection === 'left') swordX -= playerSize;
                if (facingDirection === 'right') swordX += playerSize;
                setSwordPosition({ x: swordX, y: swordY });
                onPlayerAttack({ x: swordX, y: swordY });
            }
        };

        const interval = setInterval(() => {
            updatePlayerPosition();
            handleAttack();
        }, 1000 / 32); // 32 frames per second

        return () => clearInterval(interval);
    }, [isAttacking, keysPressed, playerPosition, facingDirection, playerMoveSpeed, gameHeight, gameWidth, playerSize, onPlayerAttack]);

    return (
        <Player
            position={playerPosition}
            facingDirection={facingDirection}
            isAttacking={isAttacking}
            swordRef={swordRef}
        />
    );
};

export default PlayerComponent;
