import React from "react";
import "./matchmaking.css";
import { Link, NavLink } from "react-router-dom";
import { Button } from 'react-bootstrap';
import user from "../../assets/matchmaking/user.png";
import firstwinner from "../../assets/matchmaking/firstwinner.png";
import secondwinner from "../../assets/matchmaking/secondwinner.png";
import thirdwinner from "../../assets/matchmaking/thirdwinner.png";
import prestige from "../../assets/hubs/prestige1.png";

import Dropdown from 'react-bootstrap/Dropdown'

const MonthlyRanking = () => {
    return (

        <div className="monthly-ranking">

            <div className="monthly-list">
                <h2>Monthly Ranking</h2>


                <div className="monthly-table">

                    <div className="monthly-header">
                        <div className="monthly-type">
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Rank
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Link to="/">First</Link>
                                    <Link to="/">Second</Link>
                                    <Link to="/">Third</Link>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="monthly-name">
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Player
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Link to="/">First</Link>
                                    <Link to="/">Second</Link>
                                    <Link to="/">Third</Link>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="monthly-prestige">
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Score
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Link to="/">Highest</Link>
                                    <Link to="/">Lowest</Link>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="monthly-map">
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Wins
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Link to="/">Win</Link>
                                    <Link to="/">Lost</Link>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="monthly-join">
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Loses
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Link to="/">Win</Link>
                                    <Link to="/">Lost</Link>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        <div className="monthly-wins">
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    %Wins
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Link to="/">Win</Link>
                                    <Link to="/">Lost</Link>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>

                    <div className="monthly-body">

                        <div className="monthly-list-view first-winner">
                            <div className="monthly-type">
                                <span><img src={firstwinner} alt="premium"/> 1</span>
                            </div>
                            <div className="monthly-name">
                                <span><img src={user} alt="premium"/> Filipone <img src={prestige} alt="prestige"/></span>
                            </div>
                            <div className="monthly-prestige">
                                <span>288</span>
                            </div>
                            <div className="monthly-map">
                                <span>22</span>
                            </div>
                            <div className="monthly-join">
                                <span>0</span>
                            </div>
                            <div className="monthly-wins">
                                <span>100%</span>
                            </div>
                        </div>


                        <div className="monthly-list-view second-winner">
                            <div className="monthly-type">
                                <span><img src={secondwinner} alt="premium"/> 2</span>
                            </div>
                            <div className="monthly-name">
                                <span><img src={user} alt="premium"/> Filipone <img src={prestige} alt="prestige"/></span>
                            </div>
                            <div className="monthly-prestige">
                                <span>288</span>
                            </div>
                            <div className="monthly-map">
                                <span>22</span>
                            </div>
                            <div className="monthly-join">
                                <span>0</span>
                            </div>
                            <div className="monthly-wins">
                                <span>100%</span>
                            </div>
                        </div>


                        <div className="monthly-list-view third-winner">
                            <div className="monthly-type">
                                <span><img src={thirdwinner} alt="premium"/> 3</span>
                            </div>
                            <div className="monthly-name">
                                <span><img src={user} alt="premium"/> Filipone <img src={prestige} alt="prestige"/></span>
                            </div>
                            <div className="monthly-prestige">
                                <span>288</span>
                            </div>
                            <div className="monthly-map">
                                <span>22</span>
                            </div>
                            <div className="monthly-join">
                                <span>0</span>
                            </div>
                            <div className="monthly-wins">
                                <span>100%</span>
                            </div>
                        </div>


                        <div className="monthly-list-view">
                            <div className="monthly-type">
                                <span>4</span>
                            </div>
                            <div className="monthly-name">
                                <span><img src={user} alt="premium"/> Filipone <img src={prestige} alt="prestige"/></span>
                            </div>
                            <div className="monthly-prestige">
                                <span>288</span>
                            </div>
                            <div className="monthly-map">
                                <span>22</span>
                            </div>
                            <div className="monthly-join">
                                <span>0</span>
                            </div>
                            <div className="monthly-wins">
                                <span>100%</span>
                            </div>
                        </div>


                        <div className="monthly-list-view">
                            <div className="monthly-type">
                                <span>5</span>
                            </div>
                            <div className="monthly-name">
                                <span><img src={user} alt="premium"/> Filipone <img src={prestige} alt="prestige"/></span>
                            </div>
                            <div className="monthly-prestige">
                                <span>288</span>
                            </div>
                            <div className="monthly-map">
                                <span>22</span>
                            </div>
                            <div className="monthly-join">
                                <span>0</span>
                            </div>
                            <div className="monthly-wins">
                                <span>100%</span>
                            </div>
                        </div>

                        <div className="monthly-list-view">
                            <div className="monthly-type">
                                <span>6</span>
                            </div>
                            <div className="monthly-name">
                                <span><img src={user} alt="premium"/> Filipone <img src={prestige} alt="prestige"/></span>
                            </div>
                            <div className="monthly-prestige">
                                <span>288</span>
                            </div>
                            <div className="monthly-map">
                                <span>22</span>
                            </div>
                            <div className="monthly-join">
                                <span>0</span>
                            </div>
                            <div className="monthly-wins">
                                <span>100%</span>
                            </div>
                        </div>

                        <div className="monthly-list-view">
                            <div className="monthly-type">
                                <span>7</span>
                            </div>
                            <div className="monthly-name">
                                <span><img src={user} alt="premium"/> Filipone <img src={prestige} alt="prestige"/></span>
                            </div>
                            <div className="monthly-prestige">
                                <span>288</span>
                            </div>
                            <div className="monthly-map">
                                <span>22</span>
                            </div>
                            <div className="monthly-join">
                                <span>0</span>
                            </div>
                            <div className="monthly-wins">
                                <span>100%</span>
                            </div>
                        </div>


                        <div className="monthly-list-view">
                            <div className="monthly-type">
                                <span>8</span>
                            </div>
                            <div className="monthly-name">
                                <span><img src={user} alt="premium"/> Filipone <img src={prestige} alt="prestige"/></span>
                            </div>
                            <div className="monthly-prestige">
                                <span>288</span>
                            </div>
                            <div className="monthly-map">
                                <span>22</span>
                            </div>
                            <div className="monthly-join">
                                <span>0</span>
                            </div>
                            <div className="monthly-wins">
                                <span>100%</span>
                            </div>
                        </div>

                        <div className="monthly-list-view">
                            <div className="monthly-type">
                                <span>9</span>
                            </div>
                            <div className="monthly-name">
                                <span><img src={user} alt="premium"/> Filipone <img src={prestige} alt="prestige"/></span>
                            </div>
                            <div className="monthly-prestige">
                                <span>288</span>
                            </div>
                            <div className="monthly-map">
                                <span>22</span>
                            </div>
                            <div className="monthly-join">
                                <span>0</span>
                            </div>
                            <div className="monthly-wins">
                                <span>100%</span>
                            </div>
                        </div>

                        <div className="monthly-list-view">
                            <div className="monthly-type">
                                <span>10</span>
                            </div>
                            <div className="monthly-name">
                                <span><img src={user} alt="premium"/> Filipone <img src={prestige} alt="prestige"/></span>
                            </div>
                            <div className="monthly-prestige">
                                <span>288</span>
                            </div>
                            <div className="monthly-map">
                                <span>22</span>
                            </div>
                            <div className="monthly-join">
                                <span>0</span>
                            </div>
                            <div className="monthly-wins">
                                <span>100%</span>
                            </div>
                        </div>



                        <div className="monthly-list-view last-row">
                            <div className="monthly-type">
                                <span>38</span>
                            </div>
                            <div className="monthly-name">
                                <span><img src={user} alt="premium"/> Prueba <img src={prestige} alt="prestige"/></span>
                            </div>
                            <div className="monthly-prestige">
                                <span>85</span>
                            </div>
                            <div className="monthly-map">
                                <span>7</span>
                            </div>
                            <div className="monthly-join">
                                <span>1</span>
                            </div>
                            <div className="monthly-wins">
                                <span>93,33%</span>
                            </div>
                        </div>


                    </div>


                    <div className="monthly-footer">
                        <Button className="monthlys-btn">See more</Button>
                    </div>

                </div>
            
        
        </div>

        </div>


                  
    );
};
  
export default MonthlyRanking;