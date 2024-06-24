import React from "react";
import { Accordion, Card, Button, ProgressBar } from "react-bootstrap";
import profile from "../../assets/matchmaking/user-icon-red.png";
import arrow from "../../assets/icons/Arrow2.png";
import flag from "../../assets/friend/flag.png";
import chatleft from "../../assets/friend/chatleft.png";
import PopupWrapper from '../popups/popupwrapper';
import { getTimeFormate, GetPrestigeAccPoint } from "../../function";
const ScoutnigRight = ({ fetchAllCollections, show, handleClose, setMessage, sendMessage }) => {
  return (
    <div className="scouting-right-area">
      <div className="scouting-right-bg">
        {fetchAllCollections && fetchAllCollections.map((el, index) => {
          return <JoinedItemWithAccordian element={el} index={index} handleClose={handleClose} />
        })}
      </div>
      <PopupWrapper show={show} handleClose={handleClose} defaultClass={"contact-popup"}>
        <ContactPopup handleClose={handleClose} setMessage={setMessage} sendMessage={sendMessage} />
      </PopupWrapper>
    </div>
  );
};
export default ScoutnigRight;


const ContactPopup = ({ handleClose, setMessage, sendMessage }) => {
  return (
    <div className="contact-box-popup">
      <div className="chat-section">
        <div className="closing-icon">
          <i className="fa fa-times" aria-hidden="true" onClick={handleClose} />
        </div>
        <div className="chat-content">
          <h2>Contact</h2>
          <div className="chat-box">
            <input type="text" placeholder="write your message here..." onChange={setMessage} />
          </div>
          <div className="send-button">
            <button type="submit" onClick={sendMessage} >Send Message</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const JoinedItemWithAccordian = ({ element, index, handleClose }) => {
  const { joinedUser: { username, useravatar, _id, prestige }, createdAt, description, language, roles } = element;
  return <div className="scouting-box" key={index}>
    <Accordion defaultActiveKey={`${index}`}>
      <Card>
        <div className="card-header">
          <div className="scouting-header">
            <div className="scouting-profile">
              <img src={useravatar ? useravatar : profile} alt="profileimage" />
              <div className="profile-name">
                <h6>{username} <span className="tier2"><img src={GetPrestigeAccPoint(prestige)} alt="" /></span></h6>
                <div className="profile-bottom">
                  <p>
                    <span>
                      <img src={flag} alt="flagg" />
                    </span>
                    <span>Signed up {getTimeFormate(new Date(createdAt))} ago</span>{" "}
                    <span>0 reputation</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="scouting-contact">
              <div className="scouting-btn">
                {localStorage.getItem('userid') !== _id && <Button type="submit" onClick={() => handleClose('open', index)}> Contact</Button>}
              </div>
              <Accordion.Toggle as={Card.Header} eventKey={`${index}`}>
                <div className="icon-arrow">
                  <img src={arrow} alt="arrowimg" />
                </div>
              </Accordion.Toggle>
            </div>
          </div>
        </div>

        <Accordion.Collapse eventKey={`${index}`}>
          <Card.Body>
            <div className="scouting-body">
              <div className="decription-box">
                <div className="left-desc">
                  <h6>Description</h6>
                  <p>{description ? description : `${username} has not written any description`}</p>
                </div>
                <div className="right-desc">
                  <h6>Language</h6>
                  <p>{language.map((lang, j) => {
                    return <span key={j}>{lang.lang} {`(${lang.name})`}</span>
                  })}</p>
                </div>
              </div>
            </div>
            <div className="scouting-body-bottom">
              <div className="decription-box">
                <div className="roles-desc">
                  <h6>Roles</h6>
                  <div className="roles-image">
                    {roles && roles.map((ele, i) => {
                      return <img src={chatleft} alt="roleimage" key={i} title={ele} />
                    })}
                  </div>
                </div>
                <div className="stream-account">
                  <h6>Steam Account</h6>
                  <div className="account-info">
                    <img src={useravatar ? useravatar : profile} alt="user" />
                    <h6>{username}</h6>
                  </div>
                </div>
                <div className="stats">
                  <h6>Stats</h6>
                  <div className="stats-level">
                    <h6>0W 0L (0%)</h6>
                    <ProgressBar variant="info" now={20} />
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  </div>
}


