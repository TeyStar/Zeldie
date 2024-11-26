// src/Death.js
export const handleDeath = (setPosition, onDeath) => {
    setPosition(prevPosition => ({
        ...prevPosition,
        isDying: true
    }));

    const deathAnimation = setInterval(() => {
        setPosition(prevPosition => ({
            ...prevPosition,
            x: prevPosition.x + (Math.random() - 0.5) * 2,
            y: prevPosition.y + (Math.random() - 0.5) * 2,
            size: Math.max(1, prevPosition.size - 1)
        }));
    }, 100);

    setTimeout(() => {
        clearInterval(deathAnimation);
        onDeath();
    }, 2000);
};
