import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import TTTLogo from "../../assets/ttt-logo.png";
import Avatar0 from "../../assets/avatar0.jpeg";
import Avatar1 from "../../assets/avatar1.jpeg";
import Avatar2 from "../../assets/avatar2.jpeg";
import Avatar3 from "../../assets/avatar3.jpeg";
import Player from "./components/player";
import Swal from "sweetalert2";

import './index.css';

const HomePage = () => {

  const history = useHistory();
  const userId = localStorage.getItem('userId');
  const [users, setUsers] = useState([]);
  const avatars = [Avatar0, Avatar1, Avatar2, Avatar3];
  const [selectedOpponent, setSelectedOpponent] = useState(null);

  useEffect(() => {
    if (!userId || localStorage.getItem('userId') === 'null') {
      history.push('/login');
    } else {
      getUsers();
    }

  }, []);

  const getUsers = () => {
    axios.get('http://localhost:5000/getFreeUsers').then(response => {
      if (response.data.message === "success") {
        console.log(response.data.data.users);
        setUsers(response.data.data.users.filter(e => e.id !== userId));
      }
    }).catch(err => {
      Swal.fire(
        'Brr!',
        'Something went wrong!',
        'warning'
      );
    })
  }

  const selectPlayer = (e) => {
    setSelectedOpponent(e.target.id)
  }

  const gotoPlay = () => {
    if (selectedOpponent !== null) {
      axios.post('http://localhost:5000/createRoom', {
        myId: userId,
        opponentId: selectedOpponent
      }).then(response => {
        if (response.data.message === "success") {
          localStorage.setItem('roomId', response.data.data.roomId);
          history.push("/play");
        }
      })
     
    }
  }

  return (
    <section className="home-page">
      <div className="main-title-section">
        <img className="ttt-logo" src={TTTLogo} alt="" />
        <h1 className="title home-title is-1">Choose an opponent:</h1>
      </div>

      {
        users.length == 0 && <div className="has-text-centered mt-6"><h1 className="title is-4">Oops! No opponents online :(</h1> </div>
      }

      <div className="opponent-grid mt-4">
        {
          users && users.map((user, index) => {
            return <Player
              key={user.id}
              name={user.name}
              avatar={avatars[Math.floor(Math.random() * 4)]}
              onClick={selectPlayer}
              id={user.id}
              selected={selectedOpponent === user.id ? true : false}
            />
          })
        }
      </div>
      <div className="button-row has-text-centered mt-6">
        <button className="button is-primary is-large play-btn" onClick={gotoPlay} disabled={(users.length == 0 || selectedOpponent == null) ? true : false}>Play</button>
      </div>
    </section>
  );
}

export default HomePage;
