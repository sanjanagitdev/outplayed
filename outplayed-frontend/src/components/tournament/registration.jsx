import React from "react";
import usericon from "../../assets/tournament/user-icon.png";
//import icon from "../../assets/tournament/icon1.png";
import { GetPrestigeAccPoint } from "../../function";
//import { Button } from "react-bootstrap";

const TournamentRegistration = ({ tournamentData, handleCloseTeam, CallJoin, isExist, CheckInTournament, isCheckIn, SeeMyStatus, skip, limit, changePage }) => {
    let { gameType, Players } = tournamentData;
    Players = Players ? Players : [];
    //tournamentStart
    return (
        <div className="tournament-registration">
            <div className="registration-container">
                <div className="registration-left">
                    {Players && Players.length > 0 ? <ul className="player-list">
                        {/* Players list */}
                        {Players && Players.slice((skip * limit) - limit, skip * limit).map((el, index) => {
                            return <PlayerItem element={el} index={index} />
                        })}
                    </ul> : <div className='not-disclosed'><h4>No players found </h4></div>}
                    <div className="player-status-main">
                    <div className="player-status">
                        <button className="btn btn-tab" onClick={() => SeeMyStatus()}>See My Status</button>
                        <div className="next-btn">
                            <SimplePaging currentPage={skip} maxItemsPerPage={limit} changePage={changePage} players={Players ? Players : []} />
                            <span>{(skip * limit) - limit + Players.slice((skip * limit) - limit, skip * limit).length} / {Players ? Players.length : 0}</span>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="registration-right">
                    <div className="signup-box">
                        <div className="signup-upper">
                            <h3>Sign up</h3>
                            <p>Press the button <span> "play Tournament" </span> to participate </p>
                        </div>
                        <div className="signup-middle tooltipT">
                            {gameType === '5vs5' ? <button disabled={isExist} className="btn btn-tab" onClick={() => handleCloseTeam()} >Play Tournament</button> : <button className="btn btn-tab" onClick={() => CallJoin()} disabled={isExist}>Play Tournament</button>}
                            {isExist && <span class="tooltiptext">You already exist in this tournament !!</span>}
                        </div>
                        <div className="signup-lower">
                            <button className="check-in" disabled={isCheckIn} onClick={() => CheckInTournament()}>Check in</button>
                            <div className="check-in-time">
                                <p>Start of check in:<br /> <span>00:00</span></p>
                                <p>Time remaining: <br /><span> 05:00 </span></p>
                            </div>
                        </div>
                    </div>
                    <div className="note">
                        NOTE:The start of check-in indicates how much time remains to be able to press the button "PLAY TOURNAMENT" the remaining time
                        is the time that the player has to do it before the tournament starts.
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TournamentRegistration;
const PlayerItem = ({ element, index }) => {
    //Spna bg-red ,bg-green , player-item active
    const { username, useravatar, prestige1vs1, prestige, isClass, isStatus } = element;
    console.log("prestige =>>>", prestige1vs1, prestige);
    return <li className={`player-item ${isStatus && 'active'}`} key={index}>
        <div className="player-content">
            <div className="player-img">
                <img src={useravatar ? useravatar : usericon} />
                <div className="icon">
                    {/* GetPrestigeAccPoint */}
                    <img src={prestige1vs1 ? GetPrestigeAccPoint(prestige1vs1) : GetPrestigeAccPoint(prestige)} />
                </div>
            </div>
            <h4 className="player-name">{username}</h4>
            <span className={isClass}></span>
        </div>
    </li>
}


const SimplePaging = ({ currentPage, maxItemsPerPage, changePage, players }) => {
    return <div>
        {currentPage > 1 ?
            <button className="btn btn-tab" onClick={() => changePage('back')}>Back</button>
            : null}
        {players.length - 1 > currentPage * maxItemsPerPage ?
            <button className="btn btn-tab" onClick={() => changePage('next')}>Next</button>
            : null}
    </div>;
}

