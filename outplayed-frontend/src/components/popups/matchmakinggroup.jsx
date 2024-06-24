import React from 'react';
import { Form, Button } from "react-bootstrap";
import PopupWrapper from "./popupwrapper";
import user from "../../assets/header/group-user-icon.png";
const MatchMakingGroup = ({ show, handleClose, onlinePlyaers, joinedPlayers, selectedPlayers, selectMember, removeMember, errors, sendInvitation, userid, InviteInGroup }) => {
    return <PopupWrapper show={show} handleClose={handleClose} heading={"Invite in the group"} defaultClass={"outlayed-popup team-popup group-popup"}>
        <GroupInvite onlinePlyaers={onlinePlyaers} joinedPlayers={joinedPlayers} selectMember={selectMember} selectedPlayers={selectedPlayers} removeMember={removeMember} errors={errors} sendInvitation={sendInvitation} userid={userid} InviteInGroup={InviteInGroup} />
    </PopupWrapper>
}

const GroupInvite = ({ onlinePlyaers, joinedPlayers, selectedPlayers, selectMember, removeMember, errors, sendInvitation, userid, InviteInGroup }) => {
    return (
        <div className="add-member">
            <Form>
                {onlinePlyaers.length > 0 ? <Form.Group className="invited-players" controlId="formBasicloginone">
                    <span>Online friends</span>
                    <div className="invite-palyer-content">
                        {onlinePlyaers.length > 0 ? onlinePlyaers.map((el, i) => {
                            return <InvitedMembers element={el} index={i} InviteInGroup={InviteInGroup} />
                        }) : <span>No any friends are online, please try to add friends and then invite them into the group</span>}
                    </div>
                </Form.Group> : <h6>No any online players found</h6>}

                {/* <Form.Group className="invited-players" controlId="formBasicloginone">
                    <span>Selected Players</span>
                    <div className="invite-palyer-content">
                        {selectedPlayers.length > 0 ? selectedPlayers.map((el, i) => {
                            return <Listings element={el} index={i} handleFunction={removeMember} type='remove' removetype='state' />
                        }) : <span>No players selecetd</span>}
                    </div>
                </Form.Group> */}

                {/* <Form.Group className="invited-players" controlId="formBasicloginone">
                    <span>Current Players in the group</span>
                    <div className="invite-palyer-content">
                        {joinedPlayers.length > 0 || selectedPlayers.length > 0 ? <React.Fragment>

                            {joinedPlayers.map((el, i) => {
                                return <Listings element={el} index={i} handleFunction={removeMember} type='remove' removetype='db' userid={userid} />
                            })}

                            {selectedPlayers.map((el, i) => {
                                return <Listings element={el} index={i} handleFunction={removeMember} type='remove' removetype='state' />
                            })}

                        </React.Fragment> : <span>No players in the group</span>}
                    </div>
                </Form.Group> */}
                {/* <div className="team-popup-button">
                    <Button className="send-invitation" onClick={(e) => sendInvitation(e)} disabled={selectedPlayers.length <= 0 ? true : false}>Send Invitation</Button>
                    {errors.err && <span style={{ color: 'red' }}>{errors.err}</span>}
                </div> */}
            </Form>
        </div>
    );
};
export default MatchMakingGroup;

// const Listings = ({ element, index, InviteInGroup, type, removetype, userid }) => {
//     const { _id, username, useravatar } = element;
//     return <div className="invite-palyer-box" key={index}>
//         <div className="invite-palyer-img">
//             {type === 'select' ? <i className="fa fa-plus-circle" style={{ color: 'green' }} onClick={() => InviteInGroup(index)}></i> :
//                 _id !== userid ? <i className="fa fa-times" onClick={() => InviteInGroup(_id, removetype)}></i> : null}
//             <img src={useravatar ? useravatar : user} alt="user" />
//             <span>{username}</span>
//         </div>
//     </div>
// }

const InvitedMembers = ({ element, index, InviteInGroup }) => {
    const { _id, username, useravatar, ingroup } = element;
    return <div className={`invite-palyer-box ${ingroup ? 'ingroup' : ''}`} key={index} disabled={ingroup}>
        <div className="invite-palyer-img">
            <i class="fa fa-plus-circle" style={{ color: 'green', fontSize: '20px' }} onClick={() => {
                if (
                    window.confirm(
                        'Are you sure invite this member in your group ?'
                    )
                ) {
                    InviteInGroup(_id);
                }
            }} aria-hidden="true"></i>
            <img src={useravatar ? useravatar : user} alt="user" />
            <span>{username}</span>
        </div>
    </div>
}