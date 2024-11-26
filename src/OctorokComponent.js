// src/OctorokComponent.js
import React, { useState, useEffect } from 'react';
import Octorok from './Octorok';
import CollisionHandler from './CollisionHandler';
import { chooseNewDirection, moveTowardsPlayer, reverseDirection, shootProjectiles, updateProjectiles } from './OctorokActions';

const OctorokComponent = ({ gameWidth, gameHeight, playerSize, octorokMoveSpeed, playerPosition, isPlayerAttacking, swordRef, swordPosition }) => {
    const [octorokPosition, setOctorokPosition] = useState({ x: 200, y: 200 });
    const [octorokDirection, setOctorokDirection] = useState(Math.floor(Math.random() * 5));
    const [octorokFrames, setOctorokFrames] = useState(10);
    const [isPaused, setIsPaused] = useState(false);
    const [projectiles, setProjectiles] = useState([]);
    const [octorokHealth, setOctorokHealth] = useState(2);
    const [isHit, setIsHit] = useState(false);
    const [flashFrame, setFlashFrame] = useState(0);
    const [lastAction, setLastAction] = useState(null);
    const [isShooting, setIsShooting] = useState(false);
    const [isDead, setIsDead] = useState(false);
    const shortPauseDuration = 64;
    const projectileSpeed = octorokMoveSpeed * 2;
    const shootingDuration = 32;

    const updateOctorokPosition = () => {
        setOctorokPosition(prevPosition => {
            if (isPaused || isShooting) {
                if (octorokFrames <= 0 && !isShooting) {
                    let action;
                    do { action = Math.floor(Math.random() * 5); } while (action === lastAction);
                    setLastAction(action);
                    if (action === 4) {
                        shootProjectiles(octorokPosition, playerSize, projectileSpeed, setProjectiles, setOctorokFrames, setIsPaused, setIsShooting);
                    } else if (action === 3) {
                        setOctorokDirection(4);
                        setOctorokFrames(10);
                        setIsPaused(false);
                    } else if (action === 2) {
                        chooseNewDirection(setOctorokDirection, setOctorokFrames, setIsPaused);
                        setOctorokFrames(10);
                    } else if (action === 1) {
                        setOctorokFrames(20);
                        setIsPaused(false);
                    } else {
                        chooseNewDirection(setOctorokDirection, setOctorokFrames, setIsPaused);
                    }
                } else {
                    setOctorokFrames(octorokFrames - 1);
                }
            } else {
                if (octorokFrames <= 0) {
                    setIsPaused(true);
                    setOctorokFrames(shortPauseDuration);
                } else {
                    const newPosition = { ...prevPosition };
                    if (octorokDirection === 0) newPosition.y = Math.max(prevPosition.y - octorokMoveSpeed, 0);
                    else if (octorokDirection === 1) newPosition.y = Math.min(prevPosition.y + octorokMoveSpeed, gameHeight - playerSize);
                    else if (octorokDirection === 2) newPosition.x = Math.max(prevPosition.x - octorokMoveSpeed, 0);
                    else if (octorokDirection === 3) newPosition.x = Math.min(prevPosition.x + octorokMoveSpeed, gameWidth - playerSize);
                    else moveTowardsPlayer(playerPosition, prevPosition, setOctorokDirection);
                    if (newPosition.x === 0 || newPosition.x === gameWidth - playerSize || newPosition.y === 0 || newPosition.y === gameHeight - playerSize)
                        setOctorokDirection(reverseDirection(octorokDirection));
                    setOctorokFrames(octorokFrames - 1);
                    return newPosition;
                }
            }
            return prevPosition;
        });
    };

    const checkOctorokHit = () => {
        const distance = Math.hypot(playerPosition.x - octorokPosition.x, playerPosition.y - octorokPosition.y);
        if (isPlayerAttacking && distance < playerSize) {
            setOctorokHealth(prevHealth => Math.max(prevHealth - 2, 0));
            setIsHit(true);
            setFlashFrame(0);
        }
        if (swordRef.current) {
            const swordRect = swordRef.current.getBoundingClientRect();
            const octorokRect = { left: octorokPosition.x, top: octorokPosition.y, right: octorokPosition.x + playerSize, bottom: octorokPosition.y + playerSize };
            if (swordRect.left < octorokRect.right && swordRect.right > octorokRect.left && swordRect.top < octorokRect.bottom && swordRect.bottom > octorokRect.top) {
                setOctorokHealth(prevHealth => Math.max(prevHealth - 2, 0));
                setIsHit(true);
                setFlashFrame(0);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            updateOctorokPosition();
            updateProjectiles(projectiles, setProjectiles, gameWidth, gameHeight);
            checkOctorokHit();
        }, 1000 / 32);
        return () => clearInterval(interval);
    }, [octorokDirection, octorokFrames, isPaused, isShooting, gameWidth, gameHeight, playerSize, octorokMoveSpeed, playerPosition, isPlayerAttacking]);

    useEffect(() => {
        if (octorokHealth <= 0 && !isDead) {
            setIsDead(true);
            setIsPaused(true);
            setTimeout(() => {
                //setOctorokPosition(null); // Remove Octorok from the game
            }, 1000); // Adjust the duration as needed
        }
    }, [octorokHealth, isDead]);

    useEffect(() => {
        if (isDead) {
            const shrinkInterval = setInterval(() => {
                setOctorokPosition(prevPosition => {
                    if (prevPosition) {
                        return {
                            ...prevPosition,
                            width: Math.max(prevPosition.width - 1, 1),
                            height: Math.max(prevPosition.height - 1, 1)
                        };
                    }
                    return prevPosition;
                });
            }, 1000 / 32); // Adjust the interval as needed

            return () => clearInterval(shrinkInterval);
        }
    }, [isDead]);

    useEffect(() => {
        if (isHit) {
            const flashInterval = setInterval(() => setFlashFrame(prevFrame => prevFrame + 1), 1000 / 32);
            if (flashFrame >= 4) {
                setIsHit(false);
                clearInterval(flashInterval);
            }
            return () => clearInterval(flashInterval);
        }
    }, [isHit, flashFrame]);

    const getOctorokColor = () => (isHit ? (flashFrame % 2 === 0 ? 'white' : 'cyan') : 'red');
    const getStateClass = () => (isHit ? 'hit' : '');

    return (
        <>
            <Octorok position={octorokPosition} state={getStateClass()} color={getOctorokColor()} />
            {projectiles.map((projectile, index) => (
                <div
                    key={index}
                    className="projectile"
                    style={{
                        position: 'absolute',
                        left: `${projectile.x}px`,
                        top: `${projectile.y}px`,
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'black'
                    }}
                />
            ))}
            <CollisionHandler
                playerPosition={playerPosition}
                playerSize={playerSize}
                isPlayerAttacking={isPlayerAttacking}
                swordPosition={swordPosition}
                swordSize={{ width: 10, height: 30 }}
                octorokPosition={octorokPosition}
                octorokHealth={octorokHealth}
                setOctorokHealth={setOctorokHealth}
                setIsHit={setIsHit}
                setFlashFrame={setFlashFrame}
                setOctorokPosition={setOctorokPosition}
                gameWidth={gameWidth}
                gameHeight={gameHeight}
            />
        </>
    );
};

export default OctorokComponent;
