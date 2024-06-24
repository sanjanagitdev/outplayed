import React from 'react';
import { Button, Dropdown } from "react-bootstrap";
import PopupWrapper from "./popupwrapper";
import user from "../../assets/header/group-user-icon.png";
import arrow from '../../assets/header/arrow-down.png';
const MatchMakingTeam = ({ show, handleClose, teams, handleShow, RedirectWithTeam, errors }) => {
    return <PopupWrapper show={show} handleClose={handleClose} heading={"Select a team and start !!"} defaultClass={"outlayed-popup team-popup"}>

        {teams && teams.length > 0 ? <React.Fragment>
            {teams.map((el, i) => {
                return <TeamListDropDown element={el} index={i} RedirectWithTeam={RedirectWithTeam} />
            })}
        </React.Fragment> : <React.Fragment>
                <h3>Don’t have a team yet? Create it!</h3>
                <Button onClick={handleShow}>Create Team</Button>
            </React.Fragment>}
        {errors && Object.values(errors).map((el, i) => {
            return <li className='teampop-error' key={i}>{el}</li>
        })}
    </PopupWrapper>
}


export default MatchMakingTeam;

const TeamListDropDown = ({ element, index, RedirectWithTeam }) => {
    const { name, joinedmembers, teamlogo, _id } = element;
    return <Dropdown key={index} className="dropdown-team">
        <Dropdown.Toggle variant="success" id="dropdown-basic" className="teamlist-dropdown">
            <img src={teamlogo ? teamlogo : user} alt="team" />
            <h6>{name}</h6>
            <img src={arrow} alt="arrow" className="arrow" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
            <div className="team-listsection">
                {joinedmembers && joinedmembers.map((el, i) => {
                    return <ListItem element={el} index={i} />
                })}
            </div>
            <div className="teamlist-buuton">
            <Button onClick={() => RedirectWithTeam('team', _id)} >Start</Button>
            </div>
        </Dropdown.Menu>
    </Dropdown>
}

const ListItem = ({ element, index }) => {
    const { username, useravatar, online } = element;
    return <div className="team-list" key={index}>
        <div className="friend-text">
            <i className={`fa fa-circle ${online ? 'green' : 'gray'}`} aria-hidden="true"></i>
            <img src={useravatar ? useravatar : user} alt="friend" />
            <h6>{username}</h6>
        </div>
    </div>
}

