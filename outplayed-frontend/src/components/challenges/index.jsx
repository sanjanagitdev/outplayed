import React, { useEffect, useState, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import Layout from "../layout/layout";
import LeftSidebar from "../sidebar/leftsidebar";
import RightSidebar from "../sidebar/rightsidebar";
import UserContext from '../../context/context';
import PopupWrapper from "../popups/popupwrapper";
import { Notification } from "../../function";
import "./chall.css";
import { ladderInstance } from "../../config/axios";
import history from "../../config/history";
import "../support/support.css";

const ChhalengeComponent = () => {
    const { userDetails: { laddersChallenges }, setUserDetails } = useContext(UserContext);
    const [show, setShow] = useState(false);
    const [dateTime, setDateTime] = useState(new Date());
    const [challengeId, setChallengeId] = useState('');
    const [errors, setErrors] = useState({});

    const handleClose = () => {
        setShow(!show);
    }

    const selectChallengeToModify = (el) => {
        const { dateTime, _id } = el;
        setDateTime(new Date(dateTime));
        setChallengeId(_id);
        setShow(true);
    }

    const EditRejectAcceptTheChallenge = async (type, id) => {
        try {
            const payload = { type, dateTime };
            const response = await ladderInstance().patch(`/editRejectAccepetChallenge/${id}`, payload);
            const { data: { code, msg } } = response;
            if (code === 200) {
                Notification('success', msg);
                setShow(false);
                setChallengeId('');
            } else {
                Notification('danger', msg);
            }
        } catch (error) {
            return error
        }
    }

    return (
        <Layout header={true} footer={true}>
            <div className="team-page">
                <div className="main-wrapper">
                    <LeftSidebar mainmenu={true} increase={true} community={true} voiceserver={true} />
                    <div className="middle-wrapper">
                        <div className="support-header">
                            <h6>Ladder Challenges</h6>
                        </div>
                        <div className="support-listing support-page challenge-page">
                            <div className="support-table">
                                <div className="support-header">
                                    <div className="number">
                                        Challenge by
               </div>
                                    <div className="number">
                                        Challenge to
               </div>
                                    <div className="number">
                                        Ladder name
               </div>
                                    <div className="number">
                                        Time
               </div>
                                    <div className="answer">
                                        Action
               </div>
                                </div>
                                {laddersChallenges && laddersChallenges.map((el, i) => {
                                    return <ListItem element={el} index={i} selectChallengeToModify={selectChallengeToModify} EditRejectAcceptTheChallenge={EditRejectAcceptTheChallenge} />
                                })}
                            </div>
                        </div>

                    </div>
                    <RightSidebar />
                </div>
                {show && <EditDatePopup show={show} handleClose={handleClose} dateTime={dateTime} errors={errors} setDateTime={setDateTime} EditRejectAcceptTheChallenge={EditRejectAcceptTheChallenge} challengeId={challengeId} />}
            </div>
        </Layout>
    );
};
export default ChhalengeComponent;


const ListItem = ({ element, index, selectChallengeToModify, EditRejectAcceptTheChallenge }) => {
    const { challengeBy: { username: by }, challengeTo: { username: to, _id }, ladderid: { title }, dateTime, state, _id: challengeId, roomid } = element;
    return <div className="support-body" key={index}>
        <div className="number">
            {by}
        </div>
        <div className="number">
            {to}
        </div>
        <div className="number">
            {title}
        </div>
        <div className="number">
            {new Date(dateTime).toLocaleString()}
        </div>
        <div className="answer">
            {new Date().getTime() < new Date(dateTime).getTime() ? <React.Fragment>
                {state === 'primary' && localStorage.getItem('userid') === _id ? <React.Fragment>
                    <Button type="submit" className="btn btn-success" onClick={() => {
                        if (
                            window.confirm(
                                'Are you sure to accept this challenge request !!'
                            )
                        ) {
                            EditRejectAcceptTheChallenge('accept', challengeId);
                        }
                    }}>Accept</Button>
                    <Button type="submit" className="btn btn-danger" onClick={() => {
                        if (
                            window.confirm(
                                'Are you sure to reject this challenge request !!'
                            )
                        ) {
                            EditRejectAcceptTheChallenge('reject', challengeId);
                        }
                    }}>Reject</Button>
                    <Button type="submit" className="btn btn-primary" onClick={() => selectChallengeToModify(element)}>Edit</Button>
                </React.Fragment> : <div>{state.toLowerCase() === 'accepted' ? <button className="btn btn-success" onClick={() => history.push(`/ladderroom/?id=${roomid}`)}>Go to the room</button> : state.toUpperCase()}</div>}
            </React.Fragment> : <div style={{ color: 'red' }}>Expired</div>}

        </div>
    </div>
}


const EditDatePopup = ({ show, handleClose, dateTime, errors, setDateTime, EditRejectAcceptTheChallenge, challengeId }) => {
    return <PopupWrapper
        show={show}
        handleClose={handleClose}
        heading={"Edit challenge date"} defaultClass={"outlayed-popup team-popup group-popup"}
    >
        <div className="row">
            <div className="col-md-12 edit-date-time-ch">
                <Form.Group controlId="formBasicloginone">
                    <Form.Label>Date time: </Form.Label>
                    <DateTimePicker
                        value={dateTime}
                        selected={dateTime}
                        onChange={(e) => setDateTime(e)}
                        minDate={dateTime}
                        className="start-date"
                    />
                    {errors.dateTime && <span style={{ color: 'red' }}>{errors.dateTime}</span>}
                </Form.Group>
            </div>
        </div>
        <div className="row">
            <div className="col-md-4">
                <button className="btn btn-success" onClick={() => EditRejectAcceptTheChallenge('edit', challengeId)}>
                    Submit
                </button>
            </div>
        </div>
    </PopupWrapper>
}