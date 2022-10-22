import React from 'react';
import './index.css';

const Square = ({ value, onClick, disabled }) => {
    return (
        <button className="board-button" onClick={onClick} disabled={disabled}>
            {value}
        </button>
    );
}

export default Square;