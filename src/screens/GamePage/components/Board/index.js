import React from 'react';
import Square from '../Square';
import "./index.css";

const Board = ({ squares, onClick }) => {
    
    return (
        <div className="game-board">
            {squares.map((square, i) => (
                <Square key={i} value={square} onClick={() => onClick(i)} />
            ))}
        </div>
    );
}

export default Board;