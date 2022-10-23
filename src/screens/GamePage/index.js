import React, { useState, useEffect } from "react";
import TTTLogo from "../../assets/ttt-logo.png";
import Board from "./components/Board";
import Player from "../HomePage/components/player";
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti'
import Avatar0 from "../../assets/avatar2.jpeg";
import Avatar1 from "../../assets/avatar1.jpeg";
import Pusher from 'pusher-js';
import axios from "axios";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import useSound from 'use-sound';
import clickSoundClip from "../../assets/click.wav";
import winnerSoundClip from "../../assets/winner.wav";
import './index.css';

const GamePage = ({ play, pause, isMute }) => {

  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXisNext] = useState(true);
  const userId = localStorage.getItem('userId');
  const roomId = localStorage.getItem('roomId');
  const username = localStorage.getItem('username');
  const [isWinner, setIsWinner] = useState(false);
  const [winner, setWinner] = useState();
  const { width, height } = useWindowSize()
  const [moves, setMoves] = useState([]);
  const history = useHistory();
  const [roomData, setRoomData] = useState(null);
  const [latestMoveBy, setLatestMoveBy] = useState(null);
  const [clickSound] = useSound(clickSoundClip);
  const [winnerSound] = useSound(winnerSoundClip);

  useEffect(() => {
    if (!userId || localStorage.getItem('userId') === 'null') {
      history.replace('/login');
    }
  }, []);

  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "ap1",
      encrypted: true,
    });
    const channel = pusher.subscribe(roomId);

    channel.bind("user_joined", (data) => {
      setRoomData(data.data);
    });

    channel.bind("new_move", (data) => {
      setBoard(data.data.board);
      setXisNext(data.data.xIsNext);
      setMoves([...moves, data.data.board]);
      setWinner(data.data.winner);
      setLatestMoveBy(data.data.playedBy);
      //Confetti for the winner
      if (data.data.winner !== null && data.data.playedBy === userId) {
        winnerSound();
        setIsWinner(true);
        Swal.fire({
          title: 'You won! Yurr!',
          imageUrl: 'https://cutewallpaper.org/21/pirate-cartoon-pic/Animated-Pirate-Stickers-by-Pixel-Envision-Ltd..gif',
          imageWidth: 400,
          imageHeight: 400,
          imageAlt: 'Custom image',
          confirmButtonColor: '#f0466b',
          confirmButtonText: 'End Game'
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem('roomId');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            pusher.unsubscribe(roomId);
            history.replace('/login');
          }
        });
      } else if (data.data.winner !== null && data.data.playedBy !== userId) {
        Swal.fire({
          title: 'Game Ended!',
          imageUrl: 'https://c.tenor.com/BBdeB9b5bEQAAAAC/pirate-red-beard.gif',
          imageWidth: 400,
          imageHeight: 400,
          imageAlt: 'Custom image',
          confirmButtonColor: '#f0466b',
          confirmButtonText: 'Exit'
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem('roomId');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            pusher.unsubscribe(roomId);
            history.replace('/login');
          }
        });
      }
    });

    return () => {
      pusher.unsubscribe(roomId);
    };
  }, []);

  useEffect(() => {
    axios.post(`${process.env.REACT_APP_BASE_URL}/getRoom`, {
      roomId: roomId
    }).then(response => {
      setRoomData(response.data.data.room);
    })
  }, []);

  const handleClick = (i) => {
    clickSound();
    const boardCopy = [...board];
    if (winner || boardCopy[i]) return;
    // Put an X or an O in the clicked square
    boardCopy[i] = xIsNext ? "X" : "O";
    setBoard(boardCopy)
    axios.post(`${process.env.REACT_APP_BASE_URL}/makeMove`, {
      myId: userId,
      roomId: roomId,
      board: boardCopy,
      xIsNext: !xIsNext,
    }).then(response => {
      console.log(response.data)
    }).catch(err => {
      console.log(err)
    });
  };

  const logout = () => {
    localStorage.removeItem('roomId');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    history.replace('/login');
  }

  return (
    <section className="game-page">
      {isWinner && <Confetti
        width={width}
        height={height}
      />}
      <div className="control-buttons">
        <button class="button mute-button mr-3" onClick={() => isMute ? play() : pause()}>
          <span class="icon is-small">
            <i class={isMute ? "fas fa-volume-mute" : "fas fa-volume-up"}></i>
          </span>
        </button>
        <button className="button mute-button" onClick={logout}>
          <i class="fas fa-times mr-2"></i> Stop
        </button>
      </div>
      <div className="main-title-section">
        <img className="ttt-logo" src={TTTLogo} alt="" />
        <h1 className="title home-title is-1 mb-1">Game On!</h1>
        <p className="title is-4">Room ID: {roomId || "000000"}</p>
      </div>
      <div className="game-section">
        <div className="columns">
          <div className="column is-4">
            <Player name={username || "Player 1"} avatar={Avatar0} />
          </div>
          <div className="column is-4">
            <div className="game-board-section">
              <Board squares={board} onClick={handleClick} disabled={moves.length == 0 ? false : (latestMoveBy !== userId ? false : true)} />
            </div>
            <p className="mt-6 has-text-centered">
              {winner ? "Winner: " + winner : "Next Player: " + (xIsNext ? "X" : "O")}
            </p>
          </div>
          <div className="column is-4 has-text-centered">
            {roomData?.createdByName && <Player name={roomData?.createdByName === username ? roomData.joinedByName : roomData.createdByName} avatar={Avatar1} />}
            {!roomData?.createdByName && (
              <>
                <img className="player-avatar" src="https://content.presentermedia.com/content/animsp/00016000/16663/hourglass_rotating_md_nwm_v2.gif" />
                <h1 className="title is-3">Waiting...</h1>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="footer-text p-3 has-text-centered">
        <p className="subtitle is-6">Made with ♥️ by <a href="https://twitter.com/tikirimaarie">Suvink</a></p>
      </div>
    </section>
  );
}

export default GamePage;
