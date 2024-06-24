import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import profile from '../../assets/matchmaking/user.png';
import flag from '../../assets/friend/flag.png';
import advance from '../../assets/friend/advanced.png';
import premium from '../../assets/friend/premium.png';
import check from '../../assets/icons/check.png';

import UserProfileContext from './../../context/profilecontext';
import UserContext from '../../context/context';
import { CheckAlreadyFriend, CheckAlreadyFollow } from '../../function';

const ProfileTop = () => {
  const { profileData } = useContext(UserProfileContext);

  const {
    username,
    ispremiumadvnaced,
    ispremium,
    useravatar,
    followers,
    following,
    teams,
    _id,
  } = profileData ? profileData : {};

  return (
    <div className="profile-top-section">
      <div className="profile-top-left">
        <div className="profile-image">
          <img src={useravatar ? useravatar : profile} alt="profile" />
        </div>
        <div className="profile-content">
          <div className="user-section">
            <div className="user-name">
              <h6>{username ? username : 'User not found'}</h6>
              <img src={flag} alt="flag" />
            </div>
            <div className="circle" />
          </div>
          <div className="premium-section">
            <div className="premium-img">
              {ispremium ? <img src={premium} alt="premium" /> : null}
              <img src={check} alt="premium" />
              {ispremiumadvnaced ? <img src={advance} alt="premium" /> : null}
            </div>
            <div className="followers-section">
              <h6>
                FOLLOWERS:<span>{followers ? followers.length : 0}</span>
              </h6>
            </div>
            <div className="followers-section">
              <h6>
                FOLLOWED:<span>{following ? following.length : 0}</span>
              </h6>
            </div>
          </div>
          <div className="share-btn">
            <Button type="submit">TO SHARE</Button>
            <Button type="submit">give away subscription</Button>
          </div>
        </div>
      </div>
      <div className="profile-top-right">
        {_id !== localStorage.getItem('userid') && (
          <FriendsFollowButtons id={_id} />
        )}

        <div className="twitter-equipment">
          <div className="equipment-section">
            <h6>Equipment: {teams && teams.length}</h6>
            <div className="equipment-list">
              {teams &&
                teams.map((el, i) => {
                  return (
                    <div className="equipment-box" key={i}>
                      <img
                        src={el.teamlogo ? el.teamlogo : profile}
                        alt="user"
                      />
                      <h6>{el.name}</h6>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="twitter-section">
            <div className="twitter-box">
              <i class="fa fa-facebook-square" aria-hidden="true"></i>
            </div>
            <div className="twitter-box">
              <i class="fa fa-instagram" aria-hidden="true"></i>
            </div>
            <div className="twitter-box">
              <i class="fa fa-twitch" aria-hidden="true"></i>
            </div>
            <div className="twitter-box">
              <i class="fa fa-youtube-play" aria-hidden="true"></i>
            </div>
            <div className="twitter-box">
              <i class="fa fa-twitter-square" aria-hidden="true"></i>
            </div>
            <div className="twitter-box">
              <i class="fa fa-google-plus" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div className="streamers-section">
          <h3>STREAMERs followed:</h3>
          <div className="stremers-img">
            <img src={profile} alt="profile" />
            <img src={profile} alt="profile" />
            <img src={profile} alt="profile" />
            <img src={profile} alt="profile" />
            <img src={profile} alt="profile" />
          </div>
          <div className="view-more">
            <h6>See More</h6>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileTop;

export const FriendsFollowButtons = ({ id }) => {
  const {
    userDetails: { sentRequests, receivedRequests, friends, following },
  } = useContext(UserContext);
  const { acceptRequest, followUser, sendRequests, rejectRequest } =
    useContext(UserProfileContext);

  const { checkValid, isRequest } = CheckAlreadyFriend(
    sentRequests,
    receivedRequests,
    friends,
    id
  );

  const isFllow = CheckAlreadyFollow(id, following);

  return (
    <div className="share-btn">
      {isRequest ? (
        <>
          <button onClick={() => acceptRequest(id)} class="btn btn-primary">
            Accept
          </button>
          <button onClick={() => rejectRequest(id)} class="btn btn-primary">
            Reject
          </button>
        </>
      ) : (
        <button
          type="submit"
          class="btn btn-primary"
          onClick={() => sendRequests(id)}
          disabled={!checkValid}
        >
          Send Requests
        </button>
      )}

      <button
        type="submit"
        class="btn btn-primary"
        onClick={() => followUser(id)}
      >
        {isFllow ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
};
