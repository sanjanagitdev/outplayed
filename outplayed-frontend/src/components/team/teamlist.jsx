import React from "react";
import './team.css';
import user from '../../assets/matchmaking/user.png';
import { getTimestamp } from "../../function";
const TeamList = ({ teamData, isLogged, CheckExist, leaveTeam, deleteTeam }) => {
    const { country, name, tag, _id, creator, teamlogo } = teamData;

    return (
        <div className="team-details-section">
            <h1>Team Details</h1>
            <div className="team-list">
                <div className="team-image">
                    <img src={teamlogo ? teamlogo : user} alt="team" />
                    <h6>{name}</h6>
                    <p>Created At: {getTimestamp(_id).toLocaleString()}</p>
                    {isLogged && <React.Fragment>
                        {isLogged === creator && <p><button className="btn btn-danger delete-data" onClick={() => {
                            if (
                                window.confirm(
                                    'Are you sure wants to delete this team ? if you delete this team, team stats will be deleted.'
                                )
                            ) {
                                deleteTeam();
                            }
                        }}>Delete</button></p>}
                        {isLogged !== creator && CheckExist && <p><button className="btn btn-warning leave-data" onClick={() => {
                            if (
                                window.confirm(
                                    'Are you sure wants to leave this team ?'
                                )
                            ) {
                                leaveTeam();
                            }
                        }}>Leave</button></p>}
                    </React.Fragment>}
                </div>
                <div className="team-list-section">
                    <div className="team-details">
                        <h6>Team Name</h6>
                        <h5>{name}</h5>
                    </div>
                    <div className="team-details">
                        <h6>Team tag</h6>
                        <h5>{tag}</h5>
                    </div>
                    <div className="team-details">
                        <h6>Country </h6>
                        <h5>{JSON.parse(country).label} </h5>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TeamList;