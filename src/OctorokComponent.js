// src/OctorokComponent.js
import React, { useState, useEffect } from 'react';
import Octorok from './Octorok';
import CollisionHandler from './CollisionHandler';

const OctorokComponent = ({ gameWidth, gameHeight, playerSize, octorokMoveSpeed, playerPosition, isPlayerAttacking, swordRef, swordPosition }) => {
    const [octorokPosition, setOctorokPosition] = useState({ x: 200, y: 200 });
    const [octorokDirection, setOctorokDirection] = useState(Math.floor(Math.random() * 5));
    const [octorokFrames, setOctorokFrames] = useState(10);
    const [isPaused, setIsPaused] = useState(false);
    const [isLongPaused, setIsLongPaused] = useState(false);
    const [projectiles, setProjectiles] = useState([]);
    const [octorokHealth, setOctorokHealth] = useState(2);
    const [isHit, setIsHit] = useState(false);
    const [flashFrame, setFlashFrame] = useState(0);
    const [lastAction, setLastAction] = useState(null);
    const [isShooting, setIsShooting] = useState(false);
    const shortPauseDuration = 64; // Number of frames to short pause
    const projectileSpeed = octorokMoveSpeed * 2;
    const shootingDuration = 32; // Number of frames to shoot

    const chooseNewDirection = () => {
        const direction = Math.floor(Math.random() * 5);
        setOctorokDirection(direction);
        setOctorokFrames(10);
        setIsPaused(false);
        setIsLongPaused(false);
    };

    const moveTowardsPlayer = (prevPosition) => {
        const deltaX = playerPosition.x - prevPosition.x;
        const deltaY = playerPosition.y - prevPosition.y;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            setOctorokDirection(deltaX > 0 ? 3 : 2); // Move right or left
        } else {
            setOctorokDirection(deltaY > 0 ? 1 : 0); // Move down or up
        }
    };

    const reverseDirection = (direction) => {
        switch (direction) {
            case 0: return 1; // Up to Down
            case 1: return 0; // Down to Up
            case 2: return 3; // Left to Right
            case 3: return 2; // Right to Left
            default: return direction;
        }
    };

    const shootProjectiles = () => {
        const directions = [
            { x: 0, y: -1 }, // Up
            { x: 0, y: 1 },  // Down
            { x: -1, y: 0 }, // Left
            { x: 1, y: 0 }   // Right
        ];
        const newProjectiles = [];
        const centerX = octorokPosition.x + playerSize / 2;
        const centerY = octorokPosition.y + playerSize / 2;
        directions.forEach(direction => {
            for (let i = 0; i < 3; i++) {
                newProjectiles.push({
                    x: centerX,
                    y: centerY,
                    dx: direction.x * projectileSpeed,
                    dy: direction.y * projectileSpeed,
                    delay: i * 10 // Delay between each shot
                });
            }
        });
        setProjectiles(newProjectiles);
        setOctorokFrames(shootingDuration);
        setIsPaused(true);
        setIsLongPaused(false);
        setIsShooting(true);

        // Set a timeout to rest after shooting
        setTimeout(() => {
            setIsShooting(false);
        }, 4000);
    };

    const updateProjectiles = () => {
        setProjectiles((prevProjectiles) => {
            return prevProjectiles.map(projectile => {
                if (projectile.delay > 0) {
                    return { ...projectile, delay: projectile.delay - 1 };
                }
                return {
                    ...projectile,
                    x: projectile.x + projectile.dx,
                    y: projectile.y + projectile.dy
                };
            }).filter(projectile => 
                projectile.x >= 0 && projectile.x <= gameWidth &&
                projectile.y >= 0 && projectile.y <= gameHeight
            );
        });
    };

    const updateOctorokPosition = () => {
        setOctorokPosition((prevPosition) => {
            let newPosition = { ...prevPosition };

            if (isPaused || isShooting) {
                if (octorokFrames <= 0 && !isShooting) {
                    let action;
                    do {
                        action = Math.floor(Math.random() * 5);
                    } while (action === lastAction);

                    setLastAction(action);

                    switch (action) {
                        case 0:
                            chooseNewDirection();
                            break;
                        case 1:
                            setOctorokFrames(20); // Walk in random direction for twice as long
                            setIsPaused(false);
                            break;
                        case 2:
                            chooseNewDirection();
                            setOctorokFrames(10); // Walk in random direction, then choose a different direction
                            break;
                        case 3:
                            setOctorokDirection(4); // Walk towards player
                            setOctorokFrames(10);
                            setIsPaused(false);
                            break;
                        case 4:
                            shootProjectiles(); // Shoot projectiles
                            break;
                        default:
                            break;
                    }
                } else {
                    setOctorokFrames(octorokFrames - 1);
                }
            } else {
                if (octorokFrames <= 0) {
                    setIsPaused(true);
                    setOctorokFrames(shortPauseDuration);
                } else {
                    switch (octorokDirection) {
                        case 0: // Move up
                            newPosition.y = Math.max(prevPosition.y - octorokMoveSpeed, 0);
                            if (newPosition.y === 0) {
                                setOctorokDirection(reverseDirection(octorokDirection));
                            }
                            break;
                        case 1: // Move down
                            newPosition.y = Math.min(prevPosition.y + octorokMoveSpeed, gameHeight - playerSize);
                            if (newPosition.y === gameHeight - playerSize) {
                                setOctorokDirection(reverseDirection(octorokDirection));
                            }
                            break;
                        case 2: // Move left
                            newPosition.x = Math.max(prevPosition.x - octorokMoveSpeed, 0);
                            if (newPosition.x === 0) {
                                setOctorokDirection(reverseDirection(octorokDirection));
                            }
                            break;
                        case 3: // Move right
                            newPosition.x = Math.min(prevPosition.x + octorokMoveSpeed, gameWidth - playerSize);
                            if (newPosition.x === gameWidth - playerSize) {
                                setOctorokDirection(reverseDirection(octorokDirection));
                            }
                            break;
                        case 4: // Move towards player
                            moveTowardsPlayer(prevPosition);
                            break;
                        default:
                            break;
                    }
                    setOctorokFrames(octorokFrames - 1);
                }
            }

            return newPosition;
        });
    };

    const checkOctorokHit = () => {
        const distance = Math.sqrt(
            Math.pow(playerPosition.x - octorokPosition.x, 2) + Math.pow(playerPosition.y - octorokPosition.y, 2)
        );
        if (isPlayerAttacking && distance < playerSize) {
            setOctorokHealth((prevHealth) => Math.max(prevHealth - 2, 0));
            setIsHit(true);
            setFlashFrame(0);
        }

        if (swordRef.current) {
            const swordRect = swordRef.current.getBoundingClientRect();
            const octorokRect = {
                left: octorokPosition.x,
                top: octorokPosition.y,
                right: octorokPosition.x + playerSize,
                bottom: octorokPosition.y + playerSize
            };

            if (
                swordRect.left < octorokRect.right &&
                swordRect.right > octorokRect.left &&
                swordRect.top < octorokRect.bottom &&
                swordRect.bottom > octorokRect.top
            ) {
                setOctorokHealth((prevHealth) => Math.max(prevHealth - 2, 0));
                setIsHit(true);
                setFlashFrame(0);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            updateOctorokPosition();
            updateProjectiles();
            checkOctorokHit();
        }, 1000 / 32);
        return () => clearInterval(interval);
    }, [octorokDirection, octorokFrames, isPaused, isShooting, gameWidth, gameHeight, playerSize, octorokMoveSpeed, playerPosition, isPlayerAttacking]);

    useEffect(() => {
        if (octorokHealth <= 0) {
            console.log('Octorok is dead');
            // Handle Octorok death (e.g., remove from game, play animation, etc.)
        }
    }, [octorokHealth]);

    useEffect(() => {
        if (isHit) {
            const flashInterval = setInterval(() => {
                setFlashFrame((prevFrame) => prevFrame + 1);
            }, 1000 / 32);

            if (flashFrame >= 4) {
                setIsHit(false);
                clearInterval(flashInterval);
            }

            return () => clearInterval(flashInterval);
        }
    }, [isHit, flashFrame]);

    const getOctorokColor = () => {
        if (isHit) {
            return flashFrame % 2 === 0 ? 'white' : 'cyan';
        }
        return 'red'; // Default color
    };

    const getStateClass = () => {
        return isHit ? 'hit' : '';
    };

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
                swordSize={{ width: 10, height: 30 }} // Example sword size
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