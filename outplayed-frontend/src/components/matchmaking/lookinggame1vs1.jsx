import React from "react";
import "./matchmaking.css";
// import { Link, NavLink } from "react-router-dom";
// import { Button, Form } from 'react-bootstrap';
// import i from "../../assets/matchmaking/i.png";
import userimg from '../../assets/matchmaking/user-icon.png';
import { FormatTimer } from "../../function/index"
// import cancelimg from '../../assets/matchmaking/cross.png';

const LookingGame1vs1 = ({ StartQueue, username, useravatar, timerView: { timer, isValid }, removeQueue, QueueLength1vs1 }) => {
  return (
    <div className="looking-game">
      <div className="looking-game-selection">
        <div className="game-selection">
          <h4>MM:SOLO 1vs1</h4>
        </div>
        <div className="game-selection-1vs1">
          <img src={useravatar ? useravatar : userimg} />
          <h4 className="text">{username}</h4>
          <h6 className="timer2">{FormatTimer(timer ? timer : 0)}</h6>
          {isValid ? <button type="submit" value="start" className="btn btn-danger" onClick={() => removeQueue()}>Cancel</button> : <button type="submit" value="start" className="btn" onClick={() => StartQueue()}>START</button>}
        </div>
        <div className="gameselection-1vs1">
          <h4>IN QUEUE: <span>{QueueLength1vs1 ? QueueLength1vs1 : 0}</span></h4>
        </div>

      </div>
    </div>
  );
};

export default LookingGame1vs1;