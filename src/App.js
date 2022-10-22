import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import GamePage from './screens/GamePage';
import bgMusic from "./assets/bg-music.mp3";
import ReactHowler from 'react-howler'

const App = () => {

  const [isMute, setIsMute] = useState(true);
  const [playing, setPlaying] = useState(true);

  const play = () => {
    setPlaying(true);
  }

  const pause = () => {
    setPlaying(false);
  }

  return (
    <>
      <ReactHowler
        src={bgMusic}
        playing={playing}
        volume={0.4}
        onPause={() => setIsMute(true)}
        onPlay={() => setIsMute(false)}
        loop={true}
      />
      <Router>
        <Switch>
          <Route path="/" exact>
            <HomePage play={play} pause={pause} isMute={isMute} />
          </Route>
          <Route path="/play" exact>
            <GamePage play={play} pause={pause} isMute={isMute} />
          </Route>
          <Route path="/login" exact>
            <LoginPage play={play} pause={pause} isMute={isMute} />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
