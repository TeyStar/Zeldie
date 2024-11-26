// src/Player.js
import React from 'react';
import './Player.css';

function Player({ position, facingDirection, isAttacking, swordRef }) {
    return (
        <div
            className={`player ${facingDirection} ${isAttacking ? 'attacking' : ''}`}
            style={{ top: `${position.y}px`, left: `${position.x}px` }}
        >
            {isAttacking && <div className="sword" ref={swordRef}></div>}
        </div>
    );
}

export default Player;
