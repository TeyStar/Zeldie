// src/Octorok.js
import React from 'react';
import './Octorok.css';

const Octorok = ({ position, state, color }) => {
    const style = {
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: '30px',
        height: '30px',
        backgroundColor: color, // Apply the color prop
    };

    return <div className={`octorok ${state}`} style={style}></div>;
};

export default Octorok;
