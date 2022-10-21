import React, { useState, useEffect } from "react";
import TTTLogo from "../../assets/ttt-logo.png";
import Board from "./components/Board";
import Player from "../HomePage/components/player";
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import Avatar0 from "../../assets/avatar0.jpeg";
import Avatar1 from "../../assets/avatar1.jpeg";
import Pusher from 'pusher-js';
import './index.css';

const GamePage = () => {

  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXisNext] = useState(true);
  const userId = localStorage.getItem('userId');
  const roomId = localStorage.getItem('roomId');
  const [isWinner, setIsWinner] = useState(false);
  const { width, height } = useWindowSize()
  const [moves, setMoves] = useState();

  useEffect(() => {
    const pusher = new Pusher("6e3853dc492a3ab9e11e", {
      cluster: "ap1",
      encrypted: true,
    });
    const channel = pusher.subscribe(roomId);
    channel.bind("game_move", (data) => {
      console.log("before settin--",data);
      setMoves(data);
      console.log("message notified");
    });
  },[])

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  const winner = calculateWinner(board);


  const handleClick = (i) => {
    const boardCopy = [...board];
    // If user click an occupied square or if game is won, return
    if (winner || boardCopy[i]) return;
    // Put an X or an O in the clicked square
    boardCopy[i] = xIsNext ? "X" : "O";
    setBoard(boardCopy);
    setXisNext(!xIsNext);
  };

  return (
    <section className="home-page">
      {isWinner && <Confetti
        width={width}
        height={height}
      />}
      <div className="main-title-section">
        <img className="ttt-logo" src={TTTLogo} alt="" />
        <h1 className="title home-title is-1">Game On!</h1>
      </div>
      <div className="game-section">
        <div className="columns">
          <div className="column is-4">
            <Player name="Player 1" avatar={Avatar0} />
          </div>
          <div className="column is-4">
            <div className="game-board-section">
              <Board squares={board} onClick={handleClick} />
            </div>
            <p className="mt-6 has-text-centered">
              {winner ? "Winner: " + winner : "Next Player: " + (xIsNext ? "X" : "O")}
            </p>
          </div>
          <div className="column is-4 has-text-centered">
            <Player name="Player 2" avatar={Avatar1} />
          </div>
        </div>

      </div>
    </section>
  );
}

export default GamePage;
