import React, { useState } from 'react';
import './hubs.css';
//import { Link, NavLink } from "react-router-dom";
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import PopupWrapper from '../../components/popups/popupwrapper';
import csgo from '../../assets/hubs/csgo.png';
import user from '../../assets/hubs/user.png';
import { GetPrestigeAccPoint, queryString, Notification } from '../../function';
import { userInstance } from '../../config/axios';

const Teams = ({
  name,
  checkfull,
  team1,
  team2,
  running,
  HandleJoin,
  BothTeamsData,
  Exist,
  ScoreBoth,
  HandleExist,
}) => {
  const [show, setShow] = useState(false);
  const [downData, setDownData] = useState({
    category: '',
    description: '',
    reportedTo: '',
  });

  const handleClose = async (type, id) => {
    if (type === 'open') {
      const { id: roomid } = queryString();
      const response = await userInstance().get(
        `/checkAlreadyReported/${id}/${roomid}`
      );
      const {
        data: { code, errors },
      } = response;
      if (code === 200) {
        setDownData({ ...downData, reportedTo: id });
        setShow(!show);
      } else {
        Notification('warning', Object.values(errors)[0]);
      }
    } else {
      setShow(!show);
    }
  };
  const ThumbsUp = async (thumbsto) => {
    try {
      const { id: roomid } = queryString();
      const payload = { roomid, thumbsto };
      if (roomid) {
        const response = await userInstance().post('/thumbsUp', payload);
        const {
          data: { code, msg, errors },
        } = response;
        if (code === 200) {
          Notification('success', msg);
          setDownData({ category: '', description: '', reportedTo: '' });
          setShow(!show);
        } else if (code === 201) {
          Notification('warning', Object.values(errors)[0]);
        } else {
          Notification('danger', msg);
        }
      }
    } catch (error) {
      return;
    }
  };

  const thumbsDownCall = async () => {
    try {
      const { id: roomid } = queryString();
      const { reportedTo, category, description } = downData;
      const payload = {
        category,
        description,
        reportedTo,
        roomid,
      };
      if (roomid) {
        const response = await userInstance().post(
          '/thumbsDownAndReportIssue',
          payload
        );
        const {
          data: { code, msg, errors },
        } = response;
        if (code === 200) {
          Notification('success', msg);
        } else if (code === 201) {
          Notification('warning', Object.values(errors)[0]);
        } else {
          Notification('danger', msg);
        }
      }
    } catch (error) {
      return;
    }
  };
  return (
    <div className="teams-section">
      <div className="hub-team">
        <div className="teams-grid">
          <h2 className="gradient-text">{name}</h2>
          {checkfull === 'true' ? (
            <PlaySection
              BothTeamsData={BothTeamsData ? BothTeamsData : []}
              ScoreBoth={ScoreBoth}
              running={running}
            />
          ) : (
            <JoinItem
              HandleJoin={HandleJoin}
              Exist={Exist}
              HandleExist={HandleExist}
            />
          )}
        </div>
        {checkfull === 'true' && (
          <TeamPlayers
            handleClose={handleClose}
            ThumbsUp={ThumbsUp}
            Exist={Exist}
            running={running}
            BothTeamsData={BothTeamsData}
            team1={team1}
            team2={team2}
          />
        )}
        {show && (
          <ThumbsDownComponent
            show={show}
            handleClose={handleClose}
            downData={downData}
            setDownData={setDownData}
            thumbsDownCall={thumbsDownCall}
          />
        )}
      </div>
    </div>
  );
};
export default Teams;
const PlaySection = ({ BothTeamsData, ScoreBoth, running }) => {
  const { t } = useTranslation();
  const { team1, team2 } = ScoreBoth;
  const team1Data = BothTeamsData[0] ? BothTeamsData[0] : {};
  const team2Data = BothTeamsData[1] ? BothTeamsData[1] : {};
  const { username: username1, useravatar: steamavatar1 } = team1Data.userid
    ? team1Data.userid
    : {};
  const { username: username2, useravatar: steamavatar2 } = team2Data.userid
    ? team2Data.userid
    : {};
  return (
    <React.Fragment>
      <div className="team-one">
        <div className="team-box">
          <div className="team-pic">
            <img src={steamavatar1 ? steamavatar1 : user} alt="user" />
          </div>
          <div className="team-name">
            <h3>
              {t('hub.team')} {username1}
            </h3>
            <p>
              {t('hub.total-collection')}: <span>0</span>
            </p>
          </div>
        </div>
        <div className="win-loss">
          <div className="win-loss-text">
            <p>
              {t('global.win')}: <span>0</span>
            </p>
          </div>
          <div className="win-loss-text">
            <p>
              {t('global.losses')}: <span>0</span>
            </p>
          </div>
        </div>
      </div>
      <div className="team-result">
        {!running && (
          <h2>
            {team1 ? team1 : 0} - {team2 ? team2 : 0}
          </h2>
        )}
        <img src={csgo} alt="csgo" />
      </div>
      <div className="team-two">
        <div className="team-box">
          <div className="team-name">
            <h3>
              {t('hub.team')} {username2}
            </h3>
            <p>
              {t('hub.total-collection')}: <span>0</span>
            </p>
          </div>
          <div className="team-pic">
            <img src={steamavatar2 ? steamavatar2 : user} alt="user" />
          </div>
        </div>
        <div className="win-loss">
          <div className="win-loss-text">
            <p>
              {t('global.win')}: <span>0</span>
            </p>
          </div>
          <div className="win-loss-text">
            <p>
              {t('global.losses')}: <span>0</span>
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
const JoinItem = ({ HandleJoin, Exist, HandleExist }) => {
  const { t } = useTranslation();
  return (
    <div className="join">
      <div className="team-one"></div>
      <div className="join-team">
        {!Exist ? (
          <button className="join-btn" disabled={Exist} onClick={HandleJoin}>
            {t('hub.join')}
          </button>
        ) : (
          <button className="join-btn" onClick={HandleExist}>
            {t('hub.exit')}
          </button>
        )}
        <img src={csgo} alt="csgo" className="csgo-logo" />
      </div>
      <div className="team-two"></div>
    </div>
  );
};
const TeamPlayers = ({
  BothTeamsData,
  team1,
  team2,
  running,
  Exist,
  ThumbsUp,
  handleClose,
}) => {
  const { t } = useTranslation();
  return (
    <div className="team-players">
      <div className="player-roster-row">
        <div className="roster">{t('hub.roster')}</div>
        <div className="roster">{t('hub.roster')}</div>
      </div>
      <div className="player-row winner-row">
        {BothTeamsData.map((el, i) => {
          return (
            <React.Fragment>
              <div className="player-box">
                <span>
                  <img src={el.userid.useravatar} alt="roster-avatar" />
                </span>
                <span>{el.userid.username}</span>
                <span>
                  <img
                    src={GetPrestigeAccPoint(el.userid.prestige)}
                    alt="t-tt"
                  />
                </span>
                {!running &&
                  Exist &&
                  localStorage.getItem('userid') !== el.userid._id && (
                    <span className="for-thumbs">
                      <i
                        class="fa fa-thumbs-up"
                        aria-hidden="true"
                        onClick={() => ThumbsUp(el.userid._id)}
                      ></i>
                      <i
                        class="fa fa-thumbs-down"
                        aria-hidden="true"
                        onClick={() => handleClose('open', el.userid._id)}
                      ></i>
                    </span>
                  )}
              </div>
              {i === 0 && (
                <div className="champion">
                  <h2>C</h2>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="row">
        <div className="col-md-6">
          {team1 &&
            team1.map((el, i) => {
              return (
                <PlayerMap
                  element={el}
                  index={i}
                  running={running}
                  Exist={Exist}
                  ThumbsUp={ThumbsUp}
                  handleClose={handleClose}
                />
              );
            })}
        </div>
        <div className="col-md-6">
          {team2 &&
            team2.map((el, i) => {
              return (
                <PlayerMap
                  element={el}
                  index={i}
                  running={running}
                  Exist={Exist}
                  ThumbsUp={ThumbsUp}
                  handleClose={handleClose}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};
const PlayerMap = ({
  element,
  index,
  running,
  Exist,
  ThumbsUp,
  handleClose,
}) => {
  const {
    userid: { username, useravatar, prestige, _id },
  } = element;
  return (
    <div className="player-box" key={index}>
      <span>
        <img src={useravatar} alt="roster-avatar" />
      </span>
      <span>{username}</span>
      <span>
        <img src={GetPrestigeAccPoint(prestige)} alt="t-tt" />
      </span>
      {!running && Exist && localStorage.getItem('userid') !== _id && (
        <span className="for-thumbs">
          <i
            class="fa fa-thumbs-up"
            aria-hidden="true"
            onClick={() => ThumbsUp(_id)}
          ></i>
          <i
            class="fa fa-thumbs-down"
            aria-hidden="true"
            onClick={() => handleClose('open', _id)}
          ></i>
        </span>
      )}
    </div>
  );
};

const ThumbsDownComponent = ({
  show,
  handleClose,
  downData,
  setDownData,
  thumbsDownCall,
}) => {
  const { t } = useTranslation();
  return (
    <PopupWrapper
      show={show}
      handleClose={handleClose}
      defaultClass={' scouting-popup'}
    >
      <div className="closebtn">
        <i class="fa fa-times" aria-hidden="true" onClick={handleClose}></i>
      </div>
      <div className="popup-roles">
        <Form.Group controlId="exampleForm.ControlSelect2">
          <Form.Label>{t('hub.report-type')}</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) =>
              setDownData({ ...downData, category: e.target.value })
            }
          >
            {[
              'cheater',
              'annoying behavior',
              ' Offensive language',
              'Abandonment or inactivity',
              'others',
            ].map((el, i) => {
              return (
                <option key={i} value={el}>
                  {el}
                </option>
              );
            })}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>{t('hub.description')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            name="description"
            onChange={(e) =>
              setDownData({ ...downData, description: e.target.value })
            }
          />
        </Form.Group>
        <div className="spopup-btn">
          <Button
            type="submit"
            className="btn btn-info"
            onClick={thumbsDownCall}
          >
            {t('hub.post-issue')}
          </Button>
          <Button
            type="submit"
            className="btn btn-primary"
            onClick={handleClose}
          >
            {t('hub.cancel')}
          </Button>
        </div>
      </div>
    </PopupWrapper>
  );
};
