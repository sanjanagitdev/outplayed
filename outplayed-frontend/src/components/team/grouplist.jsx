import React from "react";
// import { Link, NavLink } from "react-router-dom";
import usericon from "../../assets/tournament/user-icon.png";
import icon from "../../assets/tournament/icon1.png";
import { GetPrestigeAccPoint } from "../../function";
import { Tab, Tabs, Table } from 'react-bootstrap'

const GroupList = ({ joinedmembers, removeMember, isLogged, CheckExist, creator }) => {
    return (
        <div className="group-details-section">
            <h1>Members/Games</h1>
            <Tabs defaultActiveKey="addfriends" id="uncontrolled-tab-example">
                <Tab eventKey="addfriends" title="Members">
                    <div className="group-details">
                        <ul className="player-list">
                            {joinedmembers ? joinedmembers.map((el, i) => {
                                return <li className="player-item" key={i}>
                                    <div className="player-content">
                                        <div className="player-img">
                                            <img src={el.useravatar ? el.useravatar : usericon} />
                                            <div className="icon">
                                                <img src={GetPrestigeAccPoint(el.prestige ? el.prestige : 1000)} />
                                            </div>
                                        </div>
                                        <h4 className="player-name">{el.username}</h4>
                                        {CheckExist && isLogged && isLogged === creator && el._id !== creator && <i className="fa fa-times custom-cross" onClick={() => {
                                            if (
                                                window.confirm(
                                                    'Are you sure to delete this member?'
                                                )
                                            ) {
                                                removeMember('teams', el._id);
                                            }
                                        }} aria-hidden="true"></i>}

                                    </div>
                                </li>
                            }) : null}
                        </ul>
                    </div>

                </Tab>
                <Tab eventKey="invitefriends" title="Last games ">
                <div className="player-stats">
            <Table striped bordered hover variant="dark" responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Matches</th>
                        <th>Kills</th>
                        <th>Assists</th>
                        <th>Deaths</th>
                        <th>KD/Ratio</th>
                    </tr>
                </thead>
                <tbody>
                        <tr>
                            <td>1</td>
                            <td>Hari</td>
                            <td>15</td>
                            <td>0</td>
                            <td>1</td>
                            <td>15.00</td>
                        </tr>
                </tbody>
            </Table>
        </div>
   

                </Tab>
            </Tabs>
        </div>
    );
};

export default GroupList;