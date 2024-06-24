import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Tabs, Tab, Form } from 'react-bootstrap';
import { TwitterShareButton, EmailShareButton } from 'react-share';
import copy from 'copy-to-clipboard';
import PopupWrapper from '../popups/popupwrapper';
import friendsicon from '../../assets/header/friend-icon.png';
import { userInstance } from '../../config/axios';
import { GetPrestigeAccPoint, Notification } from '../../function';
import UserContext from '../../context/context';
// import user from "../../assets/team/user-icon.png";
import profile from '../../assets/friend/profileimg.png';
import flagimg from '../../assets/friend/flag.png';
import steam from '../../assets/friend/steam.png';
import premiumm from '../../assets/friend/premium.png';
import advanced from '../../assets/matchmaking/advanced.png';
// import prestigio from '../../assets/friend/prestigio.png';
import moneyicon from '../../assets/friend/money-icon.png';
import twitter from '../../assets/newicon/twitter.png';
import mail from '../../assets/newicon/mail.png';
import other from '../../assets/newicon/other.png';

import chat from '../../assets/friend/chat.png';
import chatleft from '../../assets/friend/chatleft.png';
// import { ListItem } from "react-bootstrap/lib/Media";
const Friends = () => {
  const { t } = useTranslation();
  const {
    userDetails: { friends, coins, invitedfriends },
  } = useContext(UserContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="friends-sidebar">
      <div className="sidebar-header">
        <img src={friendsicon} alt="Friends" /> Friends
      </div>

      {friends && friends.length > 0 ? (
        <React.Fragment>
          <div className="friend-listsection">
            {friends.map((el, i) => {
              return <ListFriends element={el} index={i} />;
            })}
          </div>

          <Button onClick={handleShow}>{t('header.friends.add-friend')}</Button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <h3>{t('header.friends.not-friend')}</h3>
          <Button onClick={handleShow}>{t('header.friends.add-friend')}</Button>
        </React.Fragment>
      )}

      {/* Popup wrapper */}
      <PopupWrapper
        show={show}
        handleClose={handleClose}
        heading={'Add Your Friends'}
        defaultClass={'outlayed-popup friends-popup'}
      >
        <Tabs defaultActiveKey="addfriends" id="uncontrolled-tab-example">
          <Tab eventKey="addfriends" title={t('header.friends.add-friend')}>
            <AddFriend />
          </Tab>
          <Tab
            eventKey="invitefriends"
            title={t('header.friends.invite-friend')}
          >
            <InviteFriend coins={coins} invitedfriends={invitedfriends} />
          </Tab>
        </Tabs>
      </PopupWrapper>
    </div>
  );
};
export default Friends;

const AddFriend = () => {
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState([]);
  const SearchProfile = async (e) => {
    try {
      e.preventDefault();
      const { value } = e.target;
      if (value.trim()) {
        const response = await userInstance().get(`/searchProfiles/${value}`);
        const {
          data: { code, profileList },
        } = response;
        if (code === 200) {
          setProfiles(profileList);
        }
      } else {
        setProfiles([]);
      }
    } catch (error) {
      return;
    }
  };

  const sendRequest = async (e, _id) => {
    try {
      e.preventDefault();
      const response = await userInstance().post(`/sendRequest`, { _id });
      const {
        data: { code, msg },
      } = response;
      if (code === 200) {
        Notification('success', msg);
        let oldState = [...profiles];
        let index = oldState.findIndex((el) => el._id === _id);
        oldState[index].found = true;
        oldState[index].requested = true;
        setProfiles(oldState);
      } else {
        Notification('danger', msg);
      }
    } catch (error) {
      return;
    }
  };

  const acceptRequest = async (e, _id) => {
    try {
      e.preventDefault();
      const response = await userInstance().post(`/acceptRequest`, { _id });
      const {
        data: { code, msg },
      } = response;
      if (code === 200) {
        Notification('success', msg);
        let oldState = [...profiles];
        let index = oldState.findIndex((el) => el._id === _id);
        oldState[index].found = true;
        oldState[index].friends = true;
        oldState[index].recived = false;
        setProfiles(oldState);
      } else {
        Notification('danger', msg);
      }
    } catch (error) {
      return;
    }
  };

  const rejectRequest = async (e, _id) => {
    try {
      e.preventDefault();
      const response = await userInstance().post(`/rejectRequest`, { _id });
      const {
        data: { code, msg },
      } = response;
      if (code === 200) {
        Notification('success', msg);
        let oldState = [...profiles];
        let index = oldState.findIndex((el) => el._id === _id);
        oldState[index].found = false;
        oldState[index].friends = false;
        oldState[index].recived = false;
        oldState[index].requested = false;
        setProfiles(oldState);
      } else {
        Notification('danger', msg);
      }
    } catch (error) {
      return;
    }
  };

  return (
    <div className="add-friend">
      <Form>
        <div className="addfriend-section">
          <input
            type="search"
            placeholder={'search user'}
            onChange={(e) => SearchProfile(e)}
          />
          <span>
            <i class="fa fa-search" aria-hidden="true"></i>
          </span>
        </div>
        {profiles.length > 0 ? (
          <div className="friendlist-section">
            {profiles.map((el, i) => {
              return (
                <ListItem
                  element={el}
                  index={i}
                  sendRequest={sendRequest}
                  acceptRequest={acceptRequest}
                  rejectRequest={rejectRequest}
                />
              );
            })}
          </div>
        ) : (
          <div className="nodata">
            <p>{t('global.no-data')}</p>
          </div>
        )}
      </Form>
    </div>
  );
};

const InviteFriend = ({ coins, invitedfriends }) => {
  const { t } = useTranslation();
  const copyLink = () => {
    copy(
      `${window.location.origin}/?inviteid=${localStorage.getItem('userid')}`
    );
    Notification('success', 'Link copied');
  };

  return (
    <div className="invite-friend">
      <div className="invited-friend">
        <img src={moneyicon} alt="img" />
        <h6>{t('header.friends.get-bonus')}</h6>
      </div>
      <div className="row">
        <div className="col-md-8">
          <p className="shearable-link">{t('header.friends.get-link')}</p>
          <div className="social-icon">
            <div className="twitter">
              <TwitterShareButton
                url={`${
                  window.location.origin
                }/?inviteid=${localStorage.getItem('userid')}`}
                title={`Check out what I Share with you`}
              >
                <img src={twitter} alt="social-icon" />
                <p>{t('header.friends.twitter')}</p>
              </TwitterShareButton>
            </div>
            <div className="twitter">
              <EmailShareButton
                subject={`Check out what I Share with you`}
                body={`Click on this link: ${
                  window.location.origin
                }/?inviteid=${localStorage.getItem('userid')}`}
              >
                <img src={mail} alt="social-icon" />
                <p>{t('header.friends.email')}</p>
              </EmailShareButton>
            </div>
            <div className="twitter" onClick={copyLink}>
              <img src={other} alt="social-icon" />
              <p>{t('header.friends.link')}</p>
            </div>
          </div>
          <p className="shearable-link1">{t('header.friends.how-works')}</p>
          <p className="subheading">1. {t('header.friends.invite-link')}</p>
          <p className="subheading">2. {t('header.friends.register-friend')}</p>
        </div>
        <div className="col-md-4">
          <div className="coins-earn">
            <h6>{t('header.friends.coin-earned')}</h6>
            <div className="coins">
              <img src={moneyicon} alt="img" />
              <h2>{coins ? coins : 0}</h2>
            </div>
            <h6>{invitedfriends ? invitedfriends.length : 0}</h6>
            <h6>{t('header.friends.invited-friends')}</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

const ListItem = ({
  element,
  index,
  sendRequest,
  acceptRequest,
  rejectRequest,
}) => {
  const {
    username,
    useravatar,
    prestige,
    ispremium,
    found,
    requested,
    recived,
    friends,
    _id,
    profileurl,
    ispremiumadvnaced,
  } = element;
  const { t } = useTranslation();
  return (
    <div className="friend-list" key={index}>
      <div className="profile-section">
        <div className="profile">
          <img
            src={useravatar ? useravatar : profile}
            alt="profile-img"
            className="userimg"
          />
        </div>
        <div className="username">
          <h6>{username}</h6>
          {ispremium && (
            <img src={premiumm} alt="premium-img" className="premium" />
          )}
          {ispremiumadvnaced && (
            <img src={advanced} alt="premium-img" className="premium" />
          )}
        </div>
      </div>

      <div className="steam-image">
        <img src={flagimg} alt="flagimg-img" />
        {profileurl && (
          <a href={profileurl} target="_blank">
            <img src={steam} alt="steam-img" />
          </a>
        )}
      </div>

      <div className="presitigo-img">
        <img
          src={GetPrestigeAccPoint(prestige ? prestige : 1000)}
          alt="presitigo-img"
        />
      </div>

      <div className="buttonsection">
        <div className="friend-button">
          {!found && (
            <button onClick={(e) => sendRequest(e, _id)} value="addfriend">
              {t('header.friends.add-friend')}
            </button>
          )}
          {found && requested && (
            <button disabled={true} value="addfriend" className="already-send">
              {t('header.friends.request-sent')}
            </button>
          )}
          {found && recived && (
            <React.Fragment>
              <button onClick={(e) => acceptRequest(e, _id)} value="addfriend">
                {t('header.friends.accept')}
              </button>
              <button onClick={(e) => rejectRequest(e, _id)} value="addfriend">
                {t('header.friends.reject')}
              </button>
            </React.Fragment>
          )}
          {found && friends && (
            <button disabled={true} value="addfriend" className="already-send">
              {t('header.friends.friends')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ListFriends = ({ element, index }) => {
  const { bothfriends } = element;
  const { online, username, useravatar } = bothfriends[0];
  return (
    <div className="addfriend-list" key={index}>
      <div className="friend-text">
        <i
          className={`fa fa-circle ${online ? 'green' : 'gray'}`}
          aria-hidden="true"
        ></i>
        <img src={useravatar ? useravatar : profile} alt="friend" />
        <h6>{username}</h6>
      </div>
      <div className="friend-chat">
        <img src={chat} alt="chat" />
        <img src={chatleft} alt="chat" />
      </div>
    </div>
  );
};
