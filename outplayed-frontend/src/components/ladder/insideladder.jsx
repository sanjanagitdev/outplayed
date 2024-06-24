import React, { useState, useEffect, useContext } from 'react';
import Layout from '../layout/layout';
import { Tab } from 'react-bootstrap';
import Tabs from 'react-bootstrap/Tabs';
import LeftSidebar from '../sidebar/leftsidebar';
import RightSidebar from '../sidebar/rightsidebar';
import './ladder.css';
import InfoTab from './info-tab';
import matchmaking from '../../assets/menu/matchmaking.png';
import PopupWrapper from '../popups/popupwrapper';
import MatchMakingTeam from "../popups/matchmakingteam";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Rules from './rules-tab';
import Classification from './classification';
import { ChooseTime, queryString, Notification, checkPlayersStatus, ChallengePlayerValidation, NoramlDataForLadderList } from '../../function';
import { ladderInstance } from '../../config/axios';
import UserContext from "../../context/context";

const InsideLadder = () => {
  const { userDetails: { teams }, loggedIn } = useContext(UserContext);
  const [show, setShow] = useState(false);
  const [customTime, setCustomTime] = useState(false);
  const [ladders, setLadders] = useState({});
  const [showteam, setShowTeam] = useState(false);
  const [errors, setErrors] = useState({});
  const [times, setTimes] = useState(ChooseTime());
  const [chTime, setChTime] = useState('');
  const [chDate, setChDate] = useState(new Date());
  const [selectedPlayer, setSelectedPlayer] = useState({});
  const [playersOrTeamList, setPlayersOrTeamList] = useState([])
  const handleClose = () => {
    setShow(!show);
    setSelectedPlayer({});
  };
  const showTime = () => {
    setCustomTime(!customTime);
  }

  const getLaddersData = async () => {
    try {
      const { lid } = queryString();
      if (lid) {
        const response = await ladderInstance().get(`/getladders/${lid}`);
        const { code, ladderData } = response.data;
        if (code === 200) {
          const { playerJoined } = ladderData;
          setPlayersOrTeamList(NoramlDataForLadderList(playerJoined))
          setLadders(ladderData);
        }
      }
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    getLaddersData();
  }, []);

  const joinLadder = async (teamid) => {
    try {
      const { lid } = queryString();
      if (lid) {
        const response = await ladderInstance().post("/joinLadder", { lid, teamid });
        const { data: { msg, code, errors } } = response;
        if (code === 200) {
          Notification('success', msg);
        } else if (code === 201) {
          Notification('danger', Object.values(errors)[0]);
        }
        else {
          Notification('danger', msg);
        }
      }
    } catch (error) {
      return error
    }
  }
  const handleCloseTeam = () => {
    if (loggedIn) {
      setShowTeam(!showteam)
    } else {
      Notification('danger', 'Please try to login and then try to join the ladder !!')
    }
  };
  const JoinWithTeam = async (type, teamid) => {
    //Join with team
    const filterTeam = teams.filter(el => el._id === teamid);
    if (filterTeam.length > 0) {
      const { joinedmembers } = filterTeam[0];
      const { isValid, errors } = checkPlayersStatus(joinedmembers);
      if (!isValid) {
        setErrors(errors)
        return;
      }
      joinLadder(teamid);
    }
  }

  const SelectTime = (el) => {
    let oldTimes = [...times];
    oldTimes.forEach(ele => {
      if (el === ele) {
        ele.select = true;
      } else {
        ele.select = false;
      }
    })
    setTimes(oldTimes);
    setChTime(el);
    setCustomTime(false);
  }

  const ChallangeAplayer = async () => {
    try {

      let payload = { chDate, chTime };
      const { isValid, errors, selecDate } = ChallengePlayerValidation(payload);
      if (!isValid) {
        setErrors(errors);
        return
      }
      const { lid } = queryString();
      const { fromId, toId, creatorFrom, creatorTo } = selectedPlayer;
      if (fromId && toId && creatorFrom && creatorTo) {
        const payloadObject = { dateTime: selecDate, fromId, toId, lid, creatorFrom, creatorTo }
        const response = await ladderInstance().post('/challengePlayer', payloadObject);
        const { data: { code, msg } } = response;
        if (code === 200) {
          setShow(false);
          setSelectedPlayer({});
          Notification('success', msg);
        }
      }
    } catch (error) {
      console.log(error)
      return error;
    }
  }

  const selectPlayerFoChallenge = (i) => {
    if (loggedIn) {
      const oldState = [...playersOrTeamList];
      const fromUser = oldState.filter(el => el.creator === localStorage.getItem('userid'));
      if (fromUser.length > 0) {
        const { _id: toId, name: toUserOrTeamName, creator: creatorTo, } = oldState[i];
        const { _id: fromId, name: fromUserOrTeamName, creator: creatorFrom } = fromUser[0];
        setShow(true);
        setSelectedPlayer({ toId, toUserOrTeamName, index: i, fromId, fromUserOrTeamName, creatorTo, creatorFrom });
      } else {
        const { gameType } = ladders ? ladders : {};
        const msg = gameType === '5vs5' ? 'Only Team captain can challenge other teams !!' : 'Please join this ladder and then challenge other players !!';
        Notification("warning", msg);
      }
    } else {
      Notification('danger', 'Please try to login !!');
    }

  }

  const CustomInput = ({ value, onClick }) => (
    <div className="claendar-input" onClick={onClick}>
      <input type="text" placeholder="dd/mm/yyyy" value={value} />
      <i className="fa fa-calendar"></i>
    </div>
  );

  const { title, gameType, ladderEndDate } = ladders ? ladders : {};
  return (
    <Layout header={true} footer={true}>
      <div className="statistics-page">
        <div className="main-wrapper">
          <LeftSidebar
            mainmenu={true}
            increase={true}
            community={true}
            voiceserver={true}
          />
          <div className="middle-wrapper">
            <div className="ladder-page-section">
              <div className="ladder-header">
                <h6>{title}</h6>
              </div>
              <div className="ladder-tab">
                <Tabs defaultActiveKey="Clasification" id="uncontrolled-tab-example">
                  <Tab eventKey="Clasification" title="Clasification">
                    {/* <Classification laddersData={ladders} /> */}
                    <InfoTab laddersData={ladders} playersOrTeamList={playersOrTeamList} selectPlayerFoChallenge={selectPlayerFoChallenge} />
                  </Tab>
                  <Tab eventKey="info" title="Info">
                    {/* <InfoTab laddersData={ladders} playersOrTeamList={playersOrTeamList} selectPlayerFoChallenge={selectPlayerFoChallenge} /> */}
                    <Classification laddersData={ladders} />
                  </Tab>
                  <Tab eventKey="Rules" title="Rules">
                    <Rules laddersData={ladders} />
                  </Tab>

                  <Tab eventKey="Register" title="Join Ladder">
                    <div className="ladder-cutom-reg">
                      <div>
                        {gameType === '5vs5' ? <button className="btn btn-success" onClick={() => handleCloseTeam()}>
                          Register
                    </button> : <button className="btn btn-success " onClick={() => joinLadder()}>Join ladder
                      </button>}
                      </div>
                    </div>
                    {/* <Classification laddersData={ladders} /> */}
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
          <RightSidebar />
        </div>

        <PopupWrapper
          show={show}
          handleClose={handleClose}
          defaultClass={'ladder-popup'}
        >
          <div className="ladderr-popup">
            <h6>Challange a player</h6>
            <img src={matchmaking} alt="ladder" />
            <div className="ladder-play">
              <div className="player-one-ladder">From@: {selectedPlayer.fromUserOrTeamName}</div>
              <div className="player-two-ladder">To@: {selectedPlayer.toUserOrTeamName}</div>
            </div>
            <div className="choose-date">
              <h5>Choose Date</h5>
              <div className="choose-date-time">
                <DatePicker
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  minDate={new Date()}
                  maxDate={ladderEndDate ? new Date(ladderEndDate) : new Date()}
                  selected={chDate}
                  onChange={(e) => setChDate(e)}
                  customInput={<CustomInput />}
                />
                {/* <button type="submit"><i className="fa fa-calendar" /></button> */}
              </div>
            </div>
            <div className="choose-date">
              <h5>Choose Time</h5>
              <div className="choose-date-time">
                <input type="text" placeholder="time" value={chTime} />
                <button type="submit" onClick={showTime}>
                  <i className="fa fa-chevron-down" aria-hidden="true"></i>
                </button>
              </div>
            </div>
            <div className="challange-button">
              <button onClick={ChallangeAplayer}>Challange</button>
            </div>
            {customTime && <div className="custom-timepicker">
              <div className="timepicker">
                {times.map((el, i) => {
                  return <h6 className={el.select ? 'active-ch' : null} key={i} onClick={() => SelectTime(el.time, i)}>{el.time}</h6>
                })}
              </div>
            </div>
            }
            {errors.chTime && <span style={{ color: 'red' }}>{errors.chTime}</span>}
          </div>
        </PopupWrapper>
      </div>
      {showteam && <MatchMakingTeam show={showteam} handleClose={handleCloseTeam} teams={teams} handleShow={() => { }} RedirectWithTeam={JoinWithTeam} errors={errors} />}
    </Layout>
  );
};
export default InsideLadder;
