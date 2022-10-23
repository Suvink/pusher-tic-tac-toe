import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import TTTLogo from "../../assets/ttt-logo.png";
import Swal from "sweetalert2";

import './index.css';

const HomePage = ({ play, pause, isMute }) => {

  const history = useHistory();
  const userId = localStorage.getItem('userId');
  const [roomId, setRoomId] = useState();

  useEffect(() => {
    if (!userId || localStorage.getItem('userId') === 'null') {
      history.push('/login');
    }
  }, []);

  const createGame = () => {
    axios.post(`${process.env.REACT_APP_BASE_URL}/createRoom`, {
      myId: userId
    }).then(response => {
      if (response.data.message === "success") {
        localStorage.setItem('roomId', response.data.data.roomId);
        Swal.fire({
          title: 'Ask yurr friend to join!',
          text: "Room ID: " + response.data.data.roomId,
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#f0466b',
          confirmButtonText: 'Let\'s Play!'
        }).then((result) => {
          if (result.isConfirmed) {
            history.push('/play');
          }
        });
      }
    })
  }

  const joinGame = () => {
    if (!roomId) {
      Swal.fire(
        'Grr!',
        'Enter room ID!',
        'warning'
      )
      return;
    }
    axios.post(`${process.env.REACT_APP_BASE_URL}/joinRoom`, {
      myId: userId,
      roomId: roomId
    }).then(response => {
      if (response.data.message === "success") {
        localStorage.setItem('roomId', response.data.data.roomId);
        localStorage.setItem('opponentId', response.data.data.opponentId);
        history.push('/play');
      }
    })
  }

  const logout = () => {
    localStorage.removeItem('roomId');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    history.replace('/login');
  }

  return (
    <section className="home-page">
      <div className="control-buttons">
        <button className="button mute-button mr-3" onClick={() => isMute ? play() : pause()}>
          <span className="icon is-small">
            <i className={isMute ? "fas fa-volume-mute" : "fas fa-volume-up"}></i>
          </span>
        </button>
        <button className="button mute-button" onClick={logout}>
          <i className="fas fa-times mr-2"></i> Stop
        </button>
      </div>
      <div className="main-title-section">
        <img className="ttt-logo" src={TTTLogo} alt="" />
        <h1 className="title home-title is-1">Choose an option:</h1>
      </div>
      <div className="button-row has-text-centered mt-3">
        <div className="field is-grouped is-grouped-centered p-3">
          <div className="field name-input-field">
            <div className="control has-icons-left has-icons-right">
              <input className="input is-large" type="text" placeholder="Yurr Room ID sir!" onChange={(e) => setRoomId(e.target.value)} />
              <span className="icon is-medium is-left">
                <i className="fas fa-user fa-lg"></i>
              </span>
            </div>
          </div>
          <p className="control ml-4">
            <button className="button is-light is-large play-button" onClick={joinGame}>
              Join!
            </button>
          </p>
        </div>
      </div>
      <div className="button-row has-text-centered mt-2">
        <h1 className="title is-3">Or</h1>
      </div>
      <div className="button-row has-text-centered mt-1">
        <button className="button is-primary is-large play-btn" onClick={createGame}>New Game</button>
      </div>
      <div className="footer-text p-3 has-text-centered">
        <p className="subtitle is-6">Made with ♥️ by <a href="https://twitter.com/tikirimaarie">Suvink</a></p>
      </div>
    </section>
  );
}

export default HomePage;
