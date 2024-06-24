import React from "react";
import "./matchmaking.css";
// import { Link, NavLink } from "react-router-dom";
// import { Button, Form } from 'react-bootstrap';
// import i from "../../assets/matchmaking/i.png";
import userimg from "../../assets/matchmaking/user-icon.png";
import cancelimg from "../../assets/matchmaking/cross.png";
import checkimg from "../../assets/matchmaking/check.png";
import { FormatTimer } from "../../function";
import userimg1 from '../../assets/matchmaking/user-icon-red.png';
import inviteuser from '../../assets/matchmaking/group-user-icon.png';
const LookingGame5vs5 = ({
  timerView: { timer, isValid },
  typeValue: { type },
  StartQueue,
  removeQueue,
  members,
  solo,
  username,
  useravatar,
  myGroupMembers,
  isGroup,
  groupJoinedLength,
  handleClose,
  StartGroupMatchmkaing
}) => {
  // console.log(members);
  return (
    <div className="looking-game">
      <div className="looking-game-selection5vs5">
        <div className="game-selection5vs5">
          <div className="image-section">
            {!solo && <> {isGroup ? <React.Fragment>{myGroupMembers.slice(1, 3).map((el, i) => {
              return <ListGroupPlayer element={el} index={i} isGroup={isGroup} handleClose={handleClose} />
            })}</React.Fragment> : <React.Fragment>{members && members.slice(1, 3).map((el, i) => {
              return <ListTeamPlayer element={el} index={i} />
            })}</React.Fragment>}</>}
          </div>
          <h4 className="text groupbtn">
            MM:{type ? type.toUpperCase() : null}
          </h4>
        </div>
        <div className="game-selection-5vs5">
          {/* <img src={cancelimg} className="cancelbtn" /> <br /> */}
          <img src={useravatar ? useravatar : userimg} className="userimg" />
          <h4 className="text">{username}</h4>
          <h5 className="timer1">{FormatTimer(timer ? timer : 0)}</h5>
          {!isValid ? (
            <button
              type="submit"
              value="start"
              onClick={() => isGroup ? StartGroupMatchmkaing() : StartQueue()}
              className="btn start-btn"
            >
              Start
            </button>
          ) : (
              <button type="submit" value="cancel" onClick={() => removeQueue()} className="btn btn-danger">
                CANCEL
              </button>
            )}
        </div>
        <div className="game-selection5vs55">
          {isGroup && <h4 style={{ textAlign: "right" }}>INVITE TO GROUP: {groupJoinedLength ? groupJoinedLength.length : 0}/5

          {/* <img src={inviteuser} style={{ height: "40px" }} />  */}

          </h4>}
          <div className="image-section">
            {!solo && <>  {isGroup ? <React.Fragment>{myGroupMembers.slice(3, 5).map((el, i) => {
              return <ListGroupPlayer element={el} index={i} isGroup={isGroup} handleClose={handleClose} />
            })}</React.Fragment> : <React.Fragment>{members && members.slice(3, 5).map((el, i) => {
              return <ListTeamPlayer element={el} index={i} />
            })}</React.Fragment>}</>}
          </div>
          <h4>
            IN QUEUE: <span>0</span>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default LookingGame5vs5;


export const ListTeamPlayer = ({ element, index }) => {
  const { useravatar, username } = element ? element : {};
  return <div className="img1" key={index}>
    <React.Fragment>  <img src={useravatar ? useravatar : userimg} className="img1-check" />
      <p className="text">{username}</p></React.Fragment>
  </div>
}

export const ListGroupPlayer = ({ element, index: i, isGroup, handleClose }) => {
  const { user, index, invited, joined } = element ? element : {};
  const { username, useravatar } = user ? user : {};
  return <div className="img1" key={i}>
    {isGroup && <React.Fragment>
      {invited && !joined && <img src={cancelimg} className="cancelbtn" />}
      {!invited && joined && username && <img src={checkimg} className="cancelbtn" />}
      {/* <h6 className="ready-text">Not Ready</h6> */}
    </React.Fragment>}
    {username ? <React.Fragment>  <img src={useravatar ? useravatar : userimg} className="img1-check" />
      <p className="text">{username}</p></React.Fragment> : <div className="img1" onClick={() => handleClose(index, 'open')}>
        <br />
        <img src={userimg1} className="img1-check1" />
      </div>}
  </div>
}