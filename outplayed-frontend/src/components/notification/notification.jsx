import React from "react";
import './notification.css';
import profile from "../../assets/friend/profileimg.png";
import history from "../../config/history";


const NotificationPage = ({ handleshownotify, notificationData, acceptRequest, rejectRequest, joinGroup, joinTeam, wrapperRef, handleContactOpenClose }) => {


    return (
        <div className="notification-section" ref={wrapperRef}>
            <div className="notification">
                <button onClick={() => handleshownotify()} className="cancel"><i class="fa fa-times" aria-hidden="true" ></i></button>
                <div className="heading">
                    <h6>Notification</h6>
                    <h6>Mark all as Read</h6>
                </div>
                {/* <h5 className="notify-day">Today</h5> */}
                <div className="notify">
                    {notificationData && notificationData.map((el, i) => {
                        return <NotificationItem element={el} index={i} acceptRequest={acceptRequest} rejectRequest={rejectRequest} joinGroup={joinGroup} joinTeam={joinTeam} handleContactOpenClose={handleContactOpenClose} />
                    })}
                </div>
            </div>
        </div>
    )
}
export default NotificationPage;

const NotificationItem = ({ element, index, acceptRequest, rejectRequest, joinGroup, joinTeam, handleContactOpenClose }) => {
    const { _id: notifyid, type, createdAt, topic, state, sender: { username, useravatar, _id }, customObjects } = element;
    return <React.Fragment>
        {type === 'sended' && <div className="notification-row" key={index}>
            <div className="profile-text">
                <img src={useravatar ? useravatar : profile} alt="jnjk" />
                <h5>{username} send you a freind request that you have't responded to yet</h5>
            </div>
            <div className="notify-btn">
                {state === 'primary' && <React.Fragment>
                    <button type="button" class="btn btn-primary" onClick={(e) => acceptRequest(e, _id)}>Accept </button>
                    <button type="button" class="btn btn-primary" onClick={(e) => rejectRequest(e, _id)}>Reject </button>
                </React.Fragment>}
                <p>{new Date(createdAt).toLocaleString()}</p>
            </div>
        </div>}
        {type === 'accepted' && <div className="notification-row" key={index}>
            <div className="profile-text">
                <img src={useravatar ? useravatar : profile} alt="jnjk" />
                <h5>{username} accepted your friend request, now both you are friends</h5>
            </div>
            <div className="notify-btn">
                <p>{new Date(createdAt).toLocaleString()}</p>
            </div>
        </div>}

        {type === 'joingroup' && <div className="notification-row" key={index}>
            <div className="profile-text">
                <img src={useravatar ? useravatar : profile} alt="jnjk" />
                <h5>{username} Invited you for join his group</h5>
            </div>
            <div className="notify-btn">
                {state === 'primary' && <button type="button" class="btn btn-primary" onClick={() => joinGroup(notifyid)}>join group</button>}
                <p>{new Date(createdAt).toLocaleString()}</p>
            </div>
        </div>}
        {type === 'jointeam' && <div className="notification-row" key={index}>
            <div className="profile-text">
                <img src={useravatar ? useravatar : profile} alt="jnjk" />
                <h5>{username} Invited you for join his team</h5>
            </div>
            <div className="notify-btn">
                {state === 'primary' && <button type="button" class="btn btn-primary" onClick={() => joinTeam(notifyid)}>join team</button>}
                <p>{new Date(createdAt).toLocaleString()}</p>
            </div>
        </div>}
        {type === 'ladder' && <div className="notification-row" key={index}>
            <div className="profile-text">
                <img src={useravatar ? useravatar : profile} alt="jnjk" />
                <h5>{topic}</h5>
            </div>
            <div className="notify-btn">
                <p>{new Date(createdAt).toLocaleString()}</p>
            </div>
        </div>}
        {type === 'laddercap' && <div className="notification-row" key={index}>
            <div className="profile-text">
                <img src={useravatar ? useravatar : profile} alt="jnjk" />
                <h5>{topic}</h5>
            </div>
            <div className="notify-btn">
                <button type="button" class="btn btn-primary" onClick={() => history.push("/editchallenge")}>
                    View challenge
                    </button>
                <p>{new Date(createdAt).toLocaleString()}</p>
            </div>
        </div>}
        {type === 'scouting' && <div className="notification-row" key={index}>
            <div className="profile-text">
                <img src={useravatar ? useravatar : profile} alt="jnjk" />
                <h5>{username} send you a message from scouting area:- {customObjects && customObjects.message} </h5>
            </div>
            <div className="notify-btn">
                <button type="button" class="btn btn-primary" onClick={() => handleContactOpenClose('open', customObjects, _id)}>
                    Reply
                    </button>
                <p>{new Date(createdAt).toLocaleString()}</p>
            </div>
        </div>}

    </React.Fragment>
}