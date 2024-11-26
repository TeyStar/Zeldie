// src/Knockback.js
export const applyKnockback = (swordRect, octorokRect, octorokPosition, knockbackDistance, gameWidth, gameHeight, playerSize) => {
    const newOctorokPosition = { ...octorokPosition };

    if (swordRect.left < octorokRect.left) {
        newOctorokPosition.x += knockbackDistance; // Knockback to the right
    } else if (swordRect.right > octorokRect.right) {
        newOctorokPosition.x -= knockbackDistance; // Knockback to the left
    } else if (swordRect.top < octorokRect.top) {
        newOctorokPosition.y += knockbackDistance; // Knockback downwards
    } else if (swordRect.bottom > octorokRect.bottom) {
        newOctorokPosition.y -= knockbackDistance; // Knockback upwards
    }

    // Ensure the new position is within game boundaries
    newOctorokPosition.x = Math.max(0, Math.min(newOctorokPosition.x, gameWidth - playerSize));
    newOctorokPosition.y = Math.max(0, Math.min(newOctorokPosition.y, gameHeight - playerSize));

    return newOctorokPosition;
};
