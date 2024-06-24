import React from 'react';
import './hubs.css';
import { useTranslation } from 'react-i18next';
import { Button, FormControl } from 'react-bootstrap';
import { GetPrestigeAccPoint, AmPm } from '../../function';
import dummy from '../../assets/matchmaking/user.png';

const Chat = ({
  chats,
  joinedplayers,
  sendChatMessage,
  message,
  setMessage,
  userid,
  HandleSend,
  Captain,
  Exist,
  PickPlayer,
  chance,
}) => {
  const { t } = useTranslation();
  return (
    <div className="chat-section">
      <div className="player-lobby">
        <h4>{t('hub.lobby-players')}</h4>
        <ul className="custom-scroll">
          {joinedplayers &&
            joinedplayers.map((el, i) => {
              return (
                <PlayerItem
                  element={el}
                  index={i}
                  PickPlayer={PickPlayer}
                  Captain={Captain}
                  chance={chance}
                />
              );
            })}
        </ul>
      </div>
      <div className="chat-content">
        <h2>{t('hub.chat')}</h2>
        <div className="chat-box">
          <div className="chat-view custom-scroll">
            {chats &&
              chats.map((el, i) => {
                return <ChatItem element={el} index={i} userid={userid} />;
              })}
          </div>
          {Exist && (
            <div className="chat-footer">
              <div className="chat-message">
                <FormControl
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={Exist ? false : true}
                  placeholder={t('hub.send-message')}
                  onKeyPress={HandleSend}
                />
                <Button
                  disabled={Exist ? false : true}
                  onClick={() => sendChatMessage()}
                >
                  {t('hub.send')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;

const PlayerItem = ({ element, index, PickPlayer, Captain, chance }) => {
  const {
    userid: { prestige, username, _id, useravatar },
  } = element;
  const { t } = useTranslation();
  return (
    <li className="chatuser">
      <div className="chat-user-icon" key={index}>
        <img src={useravatar ? useravatar : dummy} alt="user" />
        <div className="chat-user-name">
          <span>{username}</span>
        </div>
        <img src={GetPrestigeAccPoint(prestige)} alt="user" />
      </div>

      {Captain && chance && (
        <button className="pick-player" onClick={() => PickPlayer(_id)}>
          {t('hub.pick')}
        </button>
      )}
    </li>
  );
};

const ChatItem = ({ element, index, userid }) => {
  const {
    message,
    createdAt,
    sendby: { username, _id, useravatar },
  } = element;
  return (
    <div
      className={`chat-list ${userid !== _id ? 'left-side' : 'right-side'}`}
      key={index}
    >
      <div className="chat-message">
        {userid !== _id && (
          <div className="chat-user-info">
            <img src={useravatar ? useravatar : dummy} alt="user" />
            <h5>{username} : </h5>
          </div>
        )}
        <p>{message}</p>
      </div>
      <span className="chat-time">{AmPm(createdAt)}</span>
    </div>
  );
};
