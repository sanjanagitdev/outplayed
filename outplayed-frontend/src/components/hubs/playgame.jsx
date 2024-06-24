import React from 'react';
import { useTranslation } from 'react-i18next';
import './hubs.css';
//import { Link, NavLink } from "react-router-dom";
import { Button, FormControl } from 'react-bootstrap';
// import chat1 from "../../assets/hubs/chat-icon1.png";
// import chat2 from "../../assets/hubs/chat-icon2.png";
import { GetPrestigeAccPoint, AmPm } from '../../function';
// import map from "../../assets/hubs/map.jpg";
//import chat4 from "../../assets/hubs/chat-icon4.png";

const PlayGame = ({
  maps,
  chats,
  sendChatMessage,
  message,
  setMessage,
  userid,
  HandleSend,
  Exist,
  PickMap,
  chance,
  Captain,
}) => {
  const { t } = useTranslation();
  return (
    <div className="play-game">
      {/* <div className="ip-server">
                <h4>IP SERVER: <span>XX.XXXX.XXX.XXX</span></h4>
            </div> */}
      <div className="chat-map-ban-content">
        <div className="chat-team">
          <ChatComponent
            chats={chats}
            sendChatMessage={sendChatMessage}
            message={message}
            setMessage={setMessage}
            userid={userid}
            HandleSend={HandleSend}
            Exist={Exist}
          />
        </div>
        <div className="map-ban">
          <h2>{t('hub.map-ban')}:</h2>
          <div className="map-ban-status">
            {maps &&
              maps.map((el, i) => {
                return (
                  <MapBanComponent
                    element={el}
                    index={i}
                    PickMap={PickMap}
                    chance={chance}
                    Captain={Captain}
                  />
                );
              })}
          </div>
        </div>
      </div>
      <div className="play-button">
        <Button>{t('hub.play-game')}</Button>
      </div>
    </div>
  );
};

export default PlayGame;

const ChatComponent = ({
  chats,
  sendChatMessage,
  message,
  setMessage,
  userid,
  HandleSend,
  Exist,
}) => {
  const { t } = useTranslation();
  return (
    <div className="chat-content">
      <h2>{t('hub.chat')}</h2>
      <div className="chat-box">
        <div className="chat-view custom-scroll">
          {chats &&
            chats.map((el, i) => {
              return <ChatItem element={el} index={i} userid={userid} />;
            })}
          {/* <div className="chat-list left-side">
                    <div className="chat-message">
                        <div className="chat-user-info">
                            <img src={chat1} alt="user" />
                            <h5>Player 1</h5>
                        </div>
                        <p>Hello!!</p>
                    </div>
                    <span className="chat-time">10:34</span>
                </div>
                <div className="chat-list left-side">
                    <div className="chat-message">
                        <div className="chat-user-info">
                            <img src={chat2} alt="user" />
                            <h5>Player 2</h5>
                        </div>
                        <p>Hey!!</p>
                    </div>
                    <span className="chat-time">10:34</span>
                </div>
                <div className="chat-list right-side">
                    <div className="chat-message">
                        <p>GLWP</p>
                    </div>
                    <span className="chat-time">10:34</span>
                </div> */}
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
        {/* <div className="chat-footer">
                <div className="chat-message">
                    <FormControl type="text" placeholder="Send messsge..." />
                    <Button>Send</Button>
                </div>
            </div> */}
      </div>
    </div>
  );
};

const MapBanComponent = ({ element, index, PickMap, chance, Captain }) => {
  // chance && Captain ? PickMap(title) : undefined
  const { t } = useTranslation();
  const SelectPick = (title) => {
    if (chance && Captain) {
      PickMap(title);
    }
  };
  const { title, imgurl, open } = element;
  return (
    <React.Fragment>
      {
        <div className="map-box" key={index} onClick={() => SelectPick(title)}>
          <span>{index + 1}.</span>
          <div className={`map-icon-box ${!open && 'banned-map'}`}>
            {/**banned-map */}
            <img src={imgurl} alt="map" />
            {open && <span>{title}</span>}
            {!open && <span>{t('hub.banned')}</span>}
          </div>
        </div>
      }
    </React.Fragment>
  );
};

const ChatItem = ({ element, index, userid }) => {
  const {
    message,
    createdAt,
    sendby: { username, prestige, _id },
  } = element;
  return (
    <div
      className={`chat-list ${userid !== _id ? 'left-side' : 'right-side'}`}
      key={index}
    >
      <div className="chat-message">
        {userid !== _id && (
          <div className="chat-user-info">
            <img src={GetPrestigeAccPoint(prestige)} alt="user" />
            <h5>{username}</h5>
          </div>
        )}
        <p>{message}</p>
      </div>
      <span className="chat-time">{AmPm(createdAt)}</span>
    </div>
  );
};
