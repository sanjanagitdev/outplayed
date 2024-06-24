import React, { useState, useContext } from "react";
import {useTranslation} from 'react-i18next'
import { Button, Tabs, Tab, Form } from 'react-bootstrap';
import PopupWrapper from "../popups/popupwrapper";
import UserContext from '../../context/context';
import groupicon from "../../assets/header/group-icon.png";
import user from "../../assets/header/group-user-icon.png";
import userIcon from "../../assets/header/user-icon.png";
import crown from "../../assets/header/crown-icon.png";
import { userInstance } from "../../config/axios";
import { Notification } from "../../function";
const Group = () => {
    const {t} = useTranslation();
    const { userDetails: { group, _id: userid }, userDetails, setUserDetails, RemoveFromGroup } = useContext(UserContext);
    const { members, creator } = group ? group : {};
    const { onlinefriends } = userDetails;
    const [show, setShow] = useState(false);
    const [indexValue, setIndexValue] = useState(0);
    const handleClose = () => setShow(false);
    const handleShow = (index, type) => {
        if (type === 'open') {
            setIndexValue(index)
        }
        setShow(true);
    };
    const LeaveGroup = async () => {
        try {
            const response = await userInstance().delete(`/leavegroup/${group._id}`);
            const { data: { code, msg } } = response;
            if (code === 200) {
                Notification('success', msg);
                setUserDetails({ ...userDetails, group: null });
            } else {
                Notification('danger', msg)
            }
        } catch (error) {
            return error;
        }
    }

    const InviteInGroup = async (id) => {
        const payload = { index: indexValue };
        const response = await userInstance().patch(`/inviteingroup/${id}`, payload);
        const { data: { code, msg } } = response;
        if (code === 200) {
            Notification('success', msg)
        } else {
            Notification('danger', msg)
        }
    }

    const CreateGroups = async () => {
        try {
            const response = await userInstance().post('/createGroup');
            const { data: { code, msg } } = response;
            if (code === 200) {
                Notification('success', msg)
            } else {
                Notification('danger', msg)
            }
        } catch (error) {
            return error
        }
    }

    return (
        <div className="group-sidebar">

            <div className="sidebar-header">
                <img src={groupicon} alt="Friends" /> Group
            </div>

            <div className="group-user">
                {members && members.slice(1, 3).map((el, i) => {
                    return <UserContent element={el} i={i} handleShow={handleShow} creator={creator} userid={userid} RemoveFromGroup={RemoveFromGroup} />
                })}
            </div>

            {members && <div className="user-crown">
                <img className="crown" src={crown} alt="crown" />
                <img src={members.slice(0, 1)[0].user.useravatar ? members.slice(0, 1)[0].user.useravatar : userIcon} alt="user" className="user-image1" />
            </div>}

            <div className="group-user">
                {members && members.slice(3, 5).map((el, i) => {
                    return <UserContent element={el} i={i} handleShow={handleShow} creator={creator} userid={userid} RemoveFromGroup={RemoveFromGroup} />
                })}
            </div>

            {group ? <Button onClick={() => LeaveGroup()}>Leave</Button> : <Button onClick={() => CreateGroups()}>Create Group</Button>}
            <PopupWrapper show={show} handleClose={handleClose} heading={"Group"} defaultClass={"outlayed-popup team-popup group-popup"}>
                <Tabs defaultActiveKey="creategroup" id="uncontrolled-tab-example">
                    <Tab eventKey="creategroup" title={t('header.team.add-member')}>
                        <CreateGroup t={t} onlinefriends={onlinefriends} InviteInGroup={InviteInGroup} />
                    </Tab>
                </Tabs>
            </PopupWrapper>
        </div>
    );
};
export default Group;


const CreateGroup = ({t, onlinefriends, InviteInGroup }) => {
    return (
        <div className="add-member">
            <Form>

                <Form.Group className="invited-players" controlId="formBasicloginone">
                    <span>{t('header.group.select-player')}</span>
                    <div className="invite-palyer-content">
                        {onlinefriends && onlinefriends.length > 0 ? onlinefriends.map((el, i) => {
                            return <InvitedMembers element={el} index={i} InviteInGroup={InviteInGroup} />
                        }) : <span>{t('header.group.no-friends')}</span>}
                    </div>
                </Form.Group>
            </Form>
        </div>
    );
};

const UserContent = ({ element, i, handleShow, creator, userid, RemoveFromGroup }) => {
    let { user: users, index, joined, invited } = element;
    users = users ? users : {};
    return < React.Fragment key={i} >
        <div className="image-icon">
            {creator === userid && Object.values(users).length > 0 && <span onClick={() => {
                if (
                    window.confirm(
                        'Are you sure wants to kick this player ?'
                    )
                ) {
                    RemoveFromGroup(users._id);
                }
            }}><i className="fa fa-times"></i></span>}
            <Button onClick={() => { !joined && !invited && handleShow(index, 'open') }}><img src={users.useravatar ? users.useravatar : user} alt="user" className={users.username && "user-image"} /></Button>
        </div>
    </React.Fragment >
}


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

