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
