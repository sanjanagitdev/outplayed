import React from 'react';
import { Button } from "react-bootstrap";
import PopupWrapper from "./popupwrapper";
import user from '../../assets/matchmaking/user-icon.png';
import checkimg from '../../assets/matchmaking/check.png';
import { FormatTimer } from "../../function"
const CheckJoinedPopUp = ({ show, handleClose, timer, teamArray, readyPlayer, AcceptReady }) => {
    return <PopupWrapper show={show} handleClose={handleClose} heading={"Please confirm to play the game"} defaultClass={"outlayed-popup team-popup invitegroup-popup group-popup"}>
        <div className="check-joined-list">
            <div className="invite-group">
                {teamArray && teamArray.map((el, i) => {
                    return <TeamArray element={el} index={i} readyPlayer={readyPlayer} />
                })}
            </div>
            <div className="check-join-timer">{FormatTimer(timer ? timer : 0)}</div>
            <div className="teamlist-buuton">
                {!readyPlayer && <Button onClick={() => AcceptReady()}>Confirm</Button>}
            </div>
        </div>
    </PopupWrapper>
}
export default CheckJoinedPopUp;

const TeamArray = ({ element, index }) => {
    const { ready, userid: { useravatar } } = element;
    return <div className="invitegroup-image" key={index}>
        {ready && <img src={checkimg} alt="check image" className="check-image" />}
        <img src={useravatar ? useravatar : user} alt="user" />
    </div>
}