import React from "react";
import csgo from "../../assets/tournament/money-icon.png";
import csgo1 from "../../assets/tournament/cover.jpg";



const TournamentSummary = ({ tournamentData }) => {
    const { tournamentStarted, playerJoined, banner, gameType, tournamentPrize, tournamentStart, tournamentEnd } = tournamentData;
    const startDataIs = new Date(tournamentStart).toLocaleString().split(",");
    return (
        <div className="tournament-summary">
            <div className="cover-img">
                <img src={banner ? banner : csgo1} />
            </div>
            <div className="tounament-container">
                <h3>Tournament Summary</h3>
                <p>Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor, o palabras aleatorias que no parecen ni un poco creíbles. Si vas a utilizar un pasaje de Lorem Ipsum.</p>
                <div className="summery-content">
                    <div className="summery-left">
                        <ul className="summery-list">
                            <li className="summery-item">
                                <h3>Status</h3>
                            </li>
                            <li className="summery-item">
                                <h3>Registered</h3>
                            </li>
                            <li className="summery-item">
                                <h3>Confirmation(Check-in)</h3>
                            </li>
                            <li className="summery-item">
                                <h3>Tournament Start</h3>
                            </li>
                            <li className="summery-item">
                                <h3>Game Mode</h3>
                            </li>
                            <li className="summery-item">
                                <h3>Prize</h3>
                            </li>
                        </ul>
                    </div>
                    <div className="summery-right">
                        <ul className="summery-list">
                            <li className="summery-item">
                                {!tournamentEnd ? <React.Fragment><h3>{tournamentStarted ? "Announced" : "Not Announced"} </h3></React.Fragment> : <h3>Finished </h3>}
                            </li>
                            <li className="summery-item">
                                <h3>{playerJoined ? playerJoined.length : 0} Teams</h3>
                            </li>
                            <li className="summery-item">
                                {!tournamentEnd ? <React.Fragment><h3>{tournamentStarted ? "Realized" : "Unrealized"} </h3></React.Fragment> : <h3>Finished </h3>}
                            </li>
                            <li className="summery-item summary-date">
                                <h4>{startDataIs[0]}</h4>
                                <h6>{startDataIs[1]}</h6>
                            </li>
                            <li className="summery-item">
                                <h3>{gameType}</h3>
                            </li>
                            <li className="summery-item">
                                <img src={csgo} />
                                <h3>{tournamentPrize}</h3>
                                <img src={csgo} />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TournamentSummary;


