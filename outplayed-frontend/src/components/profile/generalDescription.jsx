import React, { useContext } from 'react';
import { Tabs, Tab, Form } from 'react-bootstrap';
import search from '../../assets/header/search-icon.png';
import profile from '../../assets/matchmaking/user.png';
import flag from '../../assets/friend/flag.png';
import UserProfileContext from './../../context/profilecontext';
const GeneralDescription = () => {
  const { firiendsData, SearcFriends } = useContext(UserProfileContext);

  const { friends, commanFriends } = firiendsData ? firiendsData : {};

  return (
    <div className="genral-descrption">
      <div className="profile-tabs">
        <Tabs defaultActiveKey="0">
          <Tab eventKey="0" title={`ALL THE FRIENDS (${friends.length})`}>
            <AllFriends data={friends} type="friends" />
          </Tab>
          <Tab
            eventKey="1"
            title={`FRIENDS IN COMMON (${commanFriends.length})`}
          >
            <AllFriends data={commanFriends} type="comman" />
          </Tab>
          <Tab eventKey="2" title="friends on steam">
            <h5>Not available</h5>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};
export default GeneralDescription;

const AllFriends = ({ data, type }) => {
  const { SearcFriends } = useContext(UserProfileContext);
  return (
    <div className="all-friends-section">
      <div className="friend-search-section">
        <Form.Group controlId="formBasicEmail">
          <Form.Control
            type="search"
            placeholder="Find friend ..."
            onChange={({ target: { value } }) => SearcFriends(type, value)}
          />
          <img src={search} alt="find" />
        </Form.Group>
      </div>
      <div className="friend-list-section">
        <div className="friend-list">
          {data &&
            data.map((el, i) => {
              return <FriendItem element={el} index={i} />;
            })}
          I
        </div>
      </div>
    </div>
  );
};

const FriendItem = ({ element, index }) => {
  const { username, useravatar, _id, profileurl } = element ? element : {};
  return (
    <div className="friend-box" key={index}>
      <div className="friend-profile">
        <img src={useravatar ? useravatar : profile} alt="profilepic" />
        <h6>{username}</h6>
      </div>
      <div className="friend-country">
        <img src={flag} alt="flag" />
        {profileurl ? (
          <a href={profileurl}>
            {' '}
            <h6>Steam profile</h6>
          </a>
        ) : (
          <a href={`/profile/?id=${_id}`}>
            {' '}
            <h6>Web profile</h6>
          </a>
        )}
      </div>
    </div>
  );
};
