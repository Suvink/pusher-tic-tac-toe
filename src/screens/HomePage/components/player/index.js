import React from 'react';
import "./index.css";

const Player = (props) => {
    return (
        <div className={props.selected ? "player-block player-block-selected" : "player-block"}>
            <div className="player-img-container">
                <img className="player-avatar" src={props.avatar} alt="" />
            </div>
            <h1 className="title is-3 mb-2">{props.name}
                {props.selected ? <span><i className="check-icon fas fa-circle ml-2"></i></span> : null}
            </h1>
            <button id={props.id} className='button is-small choose-button' onClick={props.onClick}>Select</button>
        </div>
    );
}

export default Player;