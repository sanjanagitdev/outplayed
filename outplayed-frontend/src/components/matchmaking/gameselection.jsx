import React from "react";
import "./matchmaking.css";
// import { Link, NavLink } from "react-router-dom";
import { Button, Form } from 'react-bootstrap';
import i from "../../assets/matchmaking/i.png";


const GameSelection = ({ handleClose, premium, advanced, setPremium, setAdvanced, RedirectPlayerSolo, handleCloseTeam, queueLength, Play1vs1, premium1vs1, advanced1vs1, setPremium1vs1, setAdvanced1vs1 }) => {
    return (
        <div className="matchmaking-profile">
            <div className="matchmaking-bottom">
                <div className="matchmaking-selection">
                    <h4>Game Selection</h4>
                    <img src={i} alt="" />
                    <p>Information: Prizes and rules</p>
                    <h3>PLAYERS IN QUEUE: <span>{queueLength ? queueLength : 0}</span></h3>
                </div>

                <div className="matchmaking-5vs5">
                    <div className="vsbox">
                        5 VS 5
                    </div>
                    <p className="check-box"><Form.Check type="checkbox" checked={premium} onChange={() => setPremium(!premium)} />Play Only <span className="creame-text"> Premium</span></p>
                    <p className="check-box"><Form.Check type="checkbox" checked={advanced} onChange={() => setAdvanced(!advanced)} />Play Only <span className="creame-text"> Premium</span> and <span className="green-text"> Advanced</span></p>
                    <div className="solo-team">
                        <Button onClick={() => RedirectPlayerSolo('solo')}>Solo</Button>
                        <Button onClick={() => handleCloseTeam()}>Team</Button>
                        <Button onClick={() => handleClose()}>Group</Button>
                    </div>
                </div>
                <div className="matchmaking-1vs1">
                    <div className="vsbox">
                        1 VS 1
                    </div>
                    <p className="check-box"><Form.Check type="checkbox" checked={premium1vs1} onChange={() => setPremium1vs1(!premium1vs1)} />Play Only <span className="creame-text"> Premium</span></p>
                    <p className="check-box"><Form.Check type="checkbox" checked={advanced1vs1} onChange={() => setAdvanced1vs1(!advanced1vs1)} />Play Only <span className="creame-text"> Premium</span> and <span className="green-text"> Advanced</span></p>
                    <div className="solo-team">
                        <Button onClick={() => Play1vs1()}>Play 1 vs 1</Button>
                        <p>* Test your skills against a player similar to you</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameSelection;