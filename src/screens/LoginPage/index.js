import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import TTTLogo from "../../assets/ttt-logo.png";
import axios from "axios";
import Swal from "sweetalert2";
import './index.css';

const LoginPage = () => {

  const [loading, isLoading] = useState(false);
  const [username, setUsername] = useState("");
  const history = useHistory();

  const login = () => {
    if (username === "") {
      Swal.fire(
        'Grr!',
        'Enter your name!',
        'warning'
      )
      return;
    }

    axios.post("http://localhost:5000/create", {
      name: username
    }).then(response => {
      console.log(response.data)
      if (response.data.message === "success") {
        localStorage.setItem("userId", response.data.data.id);
        history.push("/");
      }
    })
  }

  return (
    <section className="home-page">
      <div className="main-title-section">
        <img className="ttt-logo" src={TTTLogo} alt="" />
        <h1 className="title home-title is-1">Howdy Player!</h1>
      </div>
      <div className="details-section has-text-centered">
        <div className="field is-grouped is-grouped-centered">
          <div className="field name-input-field">
            <div className="control has-icons-left has-icons-right">
              <input className="input is-large" type="email" placeholder="Yurr good name sir!" onChange={(e) => setUsername(e.target.value)} />
              <span className="icon is-medium is-left">
                <i className="fas fa-user fa-lg"></i>
              </span>
            </div>
          </div>
          <p className="control ml-4">
            <button className="button is-light is-large play-button" onClick={login}>
              Let's Go!
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
