// src/OctorokActions.js
export const chooseNewDirection = (setOctorokDirection, setOctorokFrames, setIsPaused) => {
    setOctorokDirection(Math.floor(Math.random() * 5));
    setOctorokFrames(10);
    setIsPaused(false);
};

export const moveTowardsPlayer = (playerPosition, prevPosition, setOctorokDirection) => {
    const deltaX = playerPosition.x - prevPosition.x;
    const deltaY = playerPosition.y - prevPosition.y;
    setOctorokDirection(Math.abs(deltaX) > Math.abs(deltaY) ? (deltaX > 0 ? 3 : 2) : (deltaY > 0 ? 1 : 0));
};

export const reverseDirection = (direction) => [1, 0, 3, 2][direction] || direction;

export const shootProjectiles = (octorokPosition, playerSize, projectileSpeed, setProjectiles, setOctorokFrames, setIsPaused, setIsShooting) => {
    const directions = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
    const centerX = octorokPosition.x + playerSize / 2;
    const centerY = octorokPosition.y + playerSize / 2;
    const newProjectiles = directions.flatMap(direction =>
        Array.from({ length: 3 }, (_, i) => ({
            x: centerX,
            y: centerY,
            dx: direction.x * projectileSpeed,
            dy: direction.y * projectileSpeed,
            delay: i * 10
        }))
    );
    setProjectiles(newProjectiles);
    setOctorokFrames(32);
    setIsPaused(true);
    setIsShooting(true);
    setTimeout(() => setIsShooting(false), 2000);
};

export const updateProjectiles = (projectiles, setProjectiles, gameWidth, gameHeight) => {
    setProjectiles(prevProjectiles =>
        prevProjectiles
            .map(projectile => (projectile.delay > 0 ? { ...projectile, delay: projectile.delay - 1 } : {
                ...projectile,
                x: projectile.x + projectile.dx,
                y: projectile.y + projectile.dy
            }))
            .filter(projectile => projectile.x >= 0 && projectile.x <= gameWidth && projectile.y >= 0 && projectile.y <= gameHeight)
    );
};

export const updateOctorokPosition = (octorokPosition, setOctorokPosition, octorokDirection, setOctorokDirection, octorokFrames, setOctorokFrames, isPaused, setIsPaused, isShooting, setIsShooting, playerPosition, gameWidth, gameHeight, playerSize, shortPauseDuration, lastAction, setLastAction, projectileSpeed, setProjectiles, octorokMoveSpeed) => {
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