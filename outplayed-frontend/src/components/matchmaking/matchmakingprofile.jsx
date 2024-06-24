import React from "react";
import "./matchmaking.css";
import { Link } from "react-router-dom";
// import { Button, Form } from 'react-bootstrap';
import user from "../../assets/matchmaking/user.png";
import premium from "../../assets/matchmaking/premium.png";
import advanced from "../../assets/matchmaking/advanced.png";
import check from "../../assets/matchmaking/tick.png";



const MatchMakingProfile = ({ username, useravatar, ispremium, ispremiumadvnaced }) => {
    return (
        <div className="matchmaking-profile">


            <div className="matchmaking-top">

                <div className="matchmaking-user">

                    <div className="matchmaking-user-box">
                        <img src={useravatar ? useravatar : user} alt="user" />
                    </div>

                    <div className="matchmaking-user-info">
                        <h3>{username}</h3>
                        <ul>
                            {ispremium && <li><Link><img src={premium} alt="premium" /></Link></li>}
                            {ispremiumadvnaced && <li><Link ><img src={advanced} alt="advanced" /></Link></li>}
                            {/* <li><Link to=""><img src={check} alt="" /></Link></li> */}
                        </ul>

                    </div>

                </div>


                <div className="matchmaking-user-stats">

                    <div className="stat-box cream-text">
                        <h4>0</h4>
                        <span>Played</span>
                    </div>

                    <div className="stat-box green-text">
                        <h4>0</h4>
                        <span>Wins</span>
                    </div>

                    <div className="stat-box red-text">
                        <h4>0</h4>
                        <span>Loses</span>
                    </div>

                    <div className="stat-box cream-text">
                        <h4>0</h4>
                        <span>%Wins</span>
                    </div>

                    <div className="stat-box cream-text">
                        <h4>0</h4>
                        <span>Score</span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MatchMakingProfile;