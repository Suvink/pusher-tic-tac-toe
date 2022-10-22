import React from 'react';
import Square from '../Square';
import "./index.css";

const Board = ({ squares, onClick, disabled }) => {

    return (
        <div className="game-board">
            {squares.map((square, i) => (
                <Square key={i} value={square} onClick={() => onClick(i)} disabled={disabled} />
            ))}
        </div>
    );
}

export default Board;