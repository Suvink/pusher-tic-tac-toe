import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import TTTLogo from "../../assets/ttt-logo.png";
import axios from "axios";
import Swal from "sweetalert2";
import './index.css';

const LoginPage = ({ play, pause, isMute }) => {

  const [username, setUsername] = useState("");
  const history = useHistory();

  const login = () => {
    play();
    if (username === "") {
      Swal.fire(
        'Grr!',
        'Enter your name!',
        'warning'
      )
      return;
    } else {
      localStorage.setItem('username', username);
      axios.post(`${process.env.REACT_APP_BASE_URL}/create`, {
        name: username
      }).then(response => {
        if (response.data.message === "success") {
          localStorage.setItem("userId", response.data.data.id);
          history.push("/");
        }
      })
    }
  }

  return (
    <section className="home-page">
      <div className="control-buttons">
        <button className="button mute-button" onClick={() => isMute ? play() : pause()}>
          <span className="icon is-small">
            <i className={isMute ? "fas fa-volume-mute" : "fas fa-volume-up"}></i>
          </span>
        </button>
      </div>
      <div className="main-title-section">
        <img className="login-ttt-logo" src={TTTLogo} alt="" />
        <h1 className="title home-title is-1">Howdy Player!</h1>
      </div>
      <div className="details-section has-text-centered pl-3 pr-3">
        <div className="field is-grouped is-grouped-centered login-inputs">
          <div className="field name-input-field">
            <div className="control has-icons-left">
              <input className="input is-large" type="email" placeholder="Yurr good name sir!" onChange={(e) => setUsername(e.target.value)} />
              <span className="icon is-medium is-left">
                <i className="fas fa-user fa-lg"></i>
              </span>
            </div>
          </div>
          <p className="control login-button">
            <button className="button is-light is-large play-button" onClick={login}>
              Let's Go!
            </button>
          </p>
        </div>
      </div>
      <div className="sponsorship mt-2">
        <a href="https://www.buymeacoffee.com/suvink" target="_blank">
          <img className="bmc-logo" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" />
        </a>
      </div>
      <div className="footer-text p-3 has-text-centered">
        <p className="subtitle is-6">Made with ♥️ by <a href="https://twitter.com/tikirimaarie">Suvink</a></p>
      </div>
    </section>
  );
}

export default LoginPage;
