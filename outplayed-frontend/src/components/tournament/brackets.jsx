import React from "react";
import playericon from '../../assets/tournament/group-user-icon.png';
import trophy from '../../assets/tournament/feature-icon-2.png';
import coin from '../../assets/tournament/money-icon.png';
import prestigio from '../../assets/tournament/Prestigio.png';


const TournamentBrakets = ({ tournamentData }) => {
    const { tournamentEnd } = tournamentData;
    return (
        <div className="tournament-bracket">
            {tournamentEnd ? <React.Fragment>
                <div class="tournament-bracket-box">
                    <ul class="tournament-bracket-list">
                        <li class="tournament-bracket-item">
                            <div class="tournament-bracket-content yellow-border ">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 1</h3>
                            </div>
                            <div class="tournament-bracket-content light-color">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 2</h3>
                            </div>
                        </li>
                        <li class="tournament-bracket-item">
                            <div class="tournament-bracket-content yellow-border">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 3</h3>
                            </div>
                            <div class="tournament-bracket-content light-color">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 4</h3>
                            </div>
                        </li>
                        <li class="tournament-bracket-item">
                            <div class="tournament-bracket-content light-color">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 5</h3>
                            </div>
                            <div class="tournament-bracket-content yellow-border">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 6</h3>
                            </div>
                        </li>
                        <li class="tournament-bracket-item">
                            <div class="tournament-bracket-content yellow-border light-green">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 7</h3>
                            </div>
                            <div class="tournament-bracket-content light-color">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 8</h3>
                            </div>
                        </li>
                        <li class="tournament-bracket-item">
                            <div class="tournament-bracket-content yellow-border">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 1</h3>
                            </div>
                            <div class="tournament-bracket-content light-color">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 2</h3>
                            </div>
                        </li>
                        <li class="tournament-bracket-item">
                            <div class="tournament-bracket-content yellow-border">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 3</h3>
                            </div>
                            <div class="tournament-bracket-content light-color">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 4</h3>
                            </div>
                        </li>
                        <li class="tournament-bracket-item">
                            <div class="tournament-bracket-content light-color">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 5</h3>
                            </div>
                            <div class="tournament-bracket-content yellow-border">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 6</h3>
                            </div>
                        </li>

                        <li class="tournament-bracket-item">
                            <div class="tournament-bracket-content yellow-border light-green">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 7</h3>
                            </div>
                            <div class="tournament-bracket-content light-color">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 8</h3>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="tournament-bracket-box">
                    <ul class="tournament-bracket-list">
                        <li class="tournament-bracket-item">
                            <div class="tournament-bracket-content">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 1</h3>
                            </div>
                            <div class="tournament-bracket-content">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 3</h3>
                            </div>
                        </li>
                        <li class="tournament-bracket-item">
                            <div class="tournament-bracket-content">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 6</h3>
                            </div>
                            <div class="tournament-bracket-content light-green">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 7</h3>
                            </div>
                        </li>
                        <li class="tournament-bracket-item">
                            <div class="tournament-bracket-content">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 1</h3>
                            </div>
                            <div class="tournament-bracket-content">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 3</h3>
                            </div>
                        </li>
                        <li class="tournament-bracket-item">
                            <div class="tournament-bracket-content">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 6</h3>
                            </div>
                            <div class="tournament-bracket-content light-green">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 7</h3>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="tournament-bracket-box">
                    <ul class="tournament-bracket-list">
                        <li class="tournament-bracket-item">
                            <div class="tournament-bracket-content">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 1</h3>
                            </div>
                            <div class="tournament-bracket-content">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 3</h3>
                            </div>
                        </li>
                        <li class="tournament-bracket-item">
                            <div class="tournament-bracket-content">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 1</h3>
                            </div>
                            <div class="tournament-bracket-content">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 3</h3>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="tournament-bracket-box">
                    <ul class="tournament-bracket-list">
                        <li class="tournament-bracket-item">
                            <div class="tournament-bracket-content">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 1</h3>
                            </div>
                            <div class="tournament-bracket-content">
                                <div className="player-icon">
                                    <img src={playericon} />
                                </div>
                                <h3>Player 3</h3>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="tournament-bracket-box tournament-winner">
                    <div className="tw-box">
                        <div className="tw-upper">
                            <div className="winner-icon">
                                <img src={trophy} />
                            </div>
                            <h3>Tournament Winner</h3>
                        </div>
                        <div className="tw-middle">
                            Player 1
                    </div>
                        <div className="tw-lower">
                            <div className="player-icon">
                                <img src={playericon} />
                                <img src={prestigio} />
                            </div>
                            <div className="prize">
                                <h3>Prize:</h3>
                                <span>1000
                                <img src={coin} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment> : <div className='not-disclosed'><h4>Currently brackets are not disclosed !!</h4></div>}
        </div>
    );
};

export default TournamentBrakets;

