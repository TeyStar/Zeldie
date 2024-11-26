import React, { useEffect } from 'react';

const CollisionHandler = ({
    playerPosition,
    playerSize,
    isPlayerAttacking,
    swordPosition,
    swordSize,
    octorokPosition,
    octorokHealth,
    setOctorokHealth,
    setIsHit,
    setFlashFrame,
    setOctorokPosition,
    gameWidth,
    gameHeight
}) => {
    useEffect(() => {
        const checkCollision = () => {
            if (isPlayerAttacking && octorokHealth > 0) {
                const swordRect = {
                    left: swordPosition.x,
                    top: swordPosition.y,
                    right: swordPosition.x + swordSize.width,
                    bottom: swordPosition.y + swordSize.height
                };
                const octorokRect = {
                    left: octorokPosition.x,
                    top: octorokPosition.y,
                    right: octorokPosition.x + playerSize,
                    bottom: octorokPosition.y + playerSize
                };

                const isColliding = 
                    swordRect.left < octorokRect.right &&
                    swordRect.right > octorokRect.left &&
                    swordRect.top < octorokRect.bottom &&
                    swordRect.bottom > octorokRect.top;

                if (isColliding) {
                    setOctorokHealth(octorokHealth - 1);
                    setIsHit(true);
                    setFlashFrame(0);
                }
            }
        };

        const interval = setInterval(checkCollision, 1000 / 32); // 32 frames per second
        return () => clearInterval(interval);
    }, [isPlayerAttacking, swordPosition, swordSize, octorokPosition, octorokHealth, setOctorokHealth, setIsHit, setFlashFrame]);

    return null;
};

export default CollisionHandler;
