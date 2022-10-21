import React from 'react';
import './index.css';

const Square = ({ value, onClick }) => {
    return (
        <button className="board-button" onClick={onClick}>
            {value}
        </button>
    );
}

export default Square;