import React, { useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import './hubs.css';
import Layout from '../layout/layout';
import LeftSidebar from '../sidebar/leftsidebar';
import RightSidebar from '../sidebar/rightsidebar';
import Teams from '../hubs/teams';
import Chat from './chat';
import ShareGame from './sharegame';
import PlayGame from './playgame';
import GameFinished from './gamefinished';
import { hubsInstance } from '../../config/axios';
import { queryString, Notification, FormatTimer } from '../../function';
import {
  socket,
  GetHubsChat,
  PlayerJoinInHub,
  PlayerJoinHubFull,
  PlayerPickTimer,
  HubGameCancelled,
  PickPlayerEvent,
  PickMapEvent,
  SetHubsIP,
  ExitFromHub,
} from '../../socket';
import { validateComment, CalculateStats } from '../../function';

const InsideGameFirst = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [userid, setUserId] = useState('');
  const [chats, setChats] = useState([]);
  const [joinedplayers, setJoinedPlayers] = useState([]);
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [BothCaptain, setBothCaptain] = useState([]);
  const [Captain, setCaptain] = useState(false);
  const [Exist, setExist] = useState(false);
  const [ChanceTimer, setChanceTimer] = useState({ timer: 0, chance: false });
  const [maps, setMaps] = useState([]);
  const [name, setName] = useState('');
  const [running, setRunning] = useState(true);
  const [checkfull, setCheckfull] = useState('');
  const [cancelled, setCancelled] = useState(false);
  const [mapvoting, setMapvoting] = useState('false');
  const [joinip, setJoinIp] = useState('');
  const [dataLoad, setDataLoad] = useState(false);
  const [userStats, setUserStats] = useState([]);
  const [ScoreBoth, setBothState] = useState({ team1: '', team2: '' });
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const [commentList, setCommentList] = useState([]);
  useEffect(() => {
    HubsData();
    //This event is used to get real time chat message
    GetHubsChat((messages) => {
      try {
        setChats((preState) => [...preState, messages]);
        document.querySelector('.chat-list:last-child').scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start',
        });
      } catch (e) {
        return 0;
      }
    });
    //This event is used to call when any player join in the hub
    PlayerJoinInHub((data) => {
      HubsData();
      setJoinedPlayers((preState) => [...preState, data]);
    });

    //When players full in lobby this socket event will call
    PlayerJoinHubFull(() => {
      HubsData();
    });

    // this function for PlayerPickTimer
    PlayerPickTimer((data) => {
      const userlocalid = localStorage.getItem('userid');
      if (data.playerid === userlocalid) {
        setChanceTimer({ timer: data.timer, chance: true });
      } else {
        setChanceTimer({ timer: data.timer, chance: false });
      }
    });

    //This socket event will when game cancelled
    HubGameCancelled((data) => {
      const { userid } = data;
      const userlocalid = localStorage.getItem('userid');
      if (userlocalid === userid) {
        Notification(
          'warning',
          'You expelled from room with 15 minutes penalty because of your inactivity in your turn'
        );
      } else {
        Notification('info', 'Player expelled from room');
      }
      setChanceTimer({ timer: 0, chance: false });
      HubsData();
    });

    //This event is used to sate players diffrent states
    PickPlayerEvent((data) => {
      const { player, team, pickplayerid } = data;
      if (team === 'team1') {
        setTeam1((preState) => [...preState, player]);
        setJoinedPlayers((preState) =>
          preState.filter((el) => el.userid._id !== pickplayerid)
        );
      } else if (team === 'team2') {
        setTeam2((preState) => [...preState, player]);
        setJoinedPlayers((preState) =>
          preState.filter((el) => el.userid._id !== pickplayerid)
        );
      }
    });

    // This function is used to get captains picked map in real time
    PickMapEvent((mapname) => {
      setMaps((preState) => setMapsFunction(preState, mapname));
    });

    SetHubsIP((ip) => {
      setJoinIp(ip.ip);
      setChanceTimer({ timer: 60, chance: false });
    });

    ExitFromHub((joinid) => {
      setJoinedPlayers((oldArray) =>
        oldArray.filter((el) => el._id !== joinid)
      );
    });
    const setMapsFunction = (preState, mapname) => {
      preState.forEach((element) => {
        if (element.title === mapname) {
          element.open = false;
        }
      });
      return preState;
    };
  }, []);
  const HubsData = async () => {
    try {
      const { id } = queryString();
      if (id) {
        const {
          data: {
            code,
            getHubsData: {
              chats: chat,
              joinedplayers,
              team1,
              team2,
              maps,
              name,
              running,
              checkfull,
              cancelled,
              mapvoting,
              joinip,
              comments,
            },
            userid,
          },
        } = await hubsInstance().get(`/hubsdetail/${id}`);
        if (code === 200) {
          setUserId(userid);
          setRunning(running);
          setChats(chat);
          setJoinedPlayers(joinedplayers);
          setMaps(maps);
          setName(name);
          setCheckfull(checkfull);
          setCancelled(cancelled);
          setMapvoting(mapvoting);
          setJoinIp(joinip);
          setCommentList(comments);
          checkExistInHub(joinedplayers, team1, team2, userid);
          if (team1.length > 0 && team2.length > 0) {
            checkCaptain(team1, team2, userid);
            if (!running) {
              // CalculateStats(team1, team2);
              const calculateMvpAll = CalculateStats(team1, team2);
              setUserStats(calculateMvpAll);
              let firstteam = calculateMvpAll.filter(
                (el) => el.type === 'team1' && el.iscaptain
              );
              let secondteam = calculateMvpAll.filter(
                (el) => el.type === 'team2' && el.iscaptain
              );
              if (firstteam.length && secondteam.length) {
                setBothState({
                  team1: firstteam[0].score,
                  team2: secondteam[0].score,
                });
              }
            }
          }
          setDataLoad(true);
          ScrollChat(chat);
        }
        socket.emit('join', id);
      }
    } catch (e) {
      return 0;
    }
  };
  const sendChatMessage = () => {
    const { id: hubid } = queryString();
    const token = localStorage.getItem('webtoken');
    const payload = { token, message, hubid };
    if (token && hubid && message) {
      socket.emit('HubChat', payload);
      setMessage('');
    }
  };
  const HandleSend = (e) => {
    if (e.charCode === 13) {
      sendChatMessage();
    }
  };
  const checkCaptain = (team1, team2, userid) => {
    const BothTeams = [...team1, ...team2];
    const CheckFromBoth = BothTeams.filter(
      (el) => el.iscaptain && el.userid._id === userid
    );
    const CheckBothCaptains = BothTeams.filter((el) => el.iscaptain);
    team1 = team1.filter((el) => !el.iscaptain);
    team2 = team2.filter((el) => !el.iscaptain);
    if (CheckFromBoth.length > 0) {
      setCaptain(true);
    }
    setTeam1(team1);
    setTeam2(team2);
    setBothCaptain(CheckBothCaptains);
  };
  const HandleJoin = async () => {
    try {
      const { id: hubid } = queryString();
      if (hubid) {
        const payload = { hubid };
        const {
          data: { code, msg, errors },
        } = await hubsInstance().put('/joinhub', payload);
        if (code === 200) {
          Notification('success', msg);
        } else if (code === 201) {
          const checkError = Object.values(errors);
          if (checkError.length > 0) {
            Notification('danger', checkError[0]);
          }
        } else {
          Notification('danger', msg);
        }
      }
    } catch (e) {
      return 0;
    }
  };
  const ScrollChat = (chat) => {
    try {
      if (chat.length > 0) {
        document.querySelector('.chat-list:last-child').scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start',
        });
      }
    } catch (e) {
      return 0;
    }
  };
  const checkExistInHub = (joinedplayers, team1, team2, userid) => {
    const FullArray = [...joinedplayers, ...team1, ...team2];
    const FilterIfExist = FullArray.filter((el) => el.userid._id === userid);
    if (FilterIfExist.length > 0) {
      setExist(true);
    }
  };
  const PickPlayer = async (pickplayerid) => {
    const { id: hubid } = queryString();
    if (hubid) {
      const payload = { pickplayerid, hubid };
      await hubsInstance().put('/pickplayer', payload);
    }
  };

  const PickMap = async (mapname) => {
    const { id: hubid } = queryString();
    if (hubid) {
      const payload = { mapname, hubid };
      await hubsInstance().put('/mapvote', payload);
    }
  };

  const PostComment = async (e) => {
    try {
      e.preventDefault();
      const { isValid, errors } = validateComment({ comment });
      setErrors(errors);
      if (!isValid) {
        return;
      }
      const { id: hubid } = queryString();
      const response = await hubsInstance().post('/postComment', {
        comment,
        hubid,
      });
      const {
        data: { code, saveComment, msg },
      } = response;
      if (code === 200) {
        Notification('success', msg);
        let oldState = [...commentList];
        oldState.unshift(saveComment);
        setCommentList(oldState);
        setComment('');
      } else {
        Notification('danger', msg);
      }
    } catch (e) {
      return 0;
    }
  };

  const HandleExist = async () => {
    try {
      const { id: hubid } = queryString();
      if (hubid) {
        const response = await hubsInstance().delete(`/exitfromhub/${hubid}`);
        const {
          data: { code, msg, joinid },
        } = response;
        if (code === 200) {
          Notification('success', msg);
          setExist(false);
        } else {
          Notification('danger', msg);
        }
      }
    } catch (e) {
      return 0;
    }
  };
  return (
    <Layout header={true} footer={true}>
      <div className="game-finished-page">
        <div className="main-wrapper">
          <LeftSidebar
            mainmenu={true}
            increase={true}
            community={true}
            voiceserver={true}
          />
          {dataLoad && (
            <div className="middle-wrapper">
              <div className="game-finished-top-section">
                <Teams
                  name={`${name} 's Hub`}
                  checkfull={checkfull}
                  team1={team1}
                  team2={team2}
                  running={running}
                  HandleJoin={HandleJoin}
                  BothTeamsData={BothCaptain}
                  ChanceTimer={ChanceTimer}
                  Exist={Exist}
                  ScoreBoth={ScoreBoth}
                  HandleExist={HandleExist}
                />
              </div>
              {running ? (
                <React.Fragment>
                  {checkfull === 'true' && (
                    <TimerAndJoinIpSection
                      ChanceTimer={ChanceTimer}
                      Captain={Captain}
                      cancelled={cancelled}
                      mapvoting={mapvoting}
                      joinip={joinip}
                      Exist={Exist}
                    />
                  )}
                  <div className="game-finished-content">
                    {mapvoting === 'false' && (
                      <React.Fragment>
                        <Chat
                          chats={chats}
                          joinedplayers={joinedplayers}
                          sendChatMessage={sendChatMessage}
                          message={message}
                          setMessage={setMessage}
                          userid={userid}
                          HandleSend={HandleSend}
                          Captain={Captain}
                          Exist={Exist}
                          PickPlayer={PickPlayer}
                          chance={ChanceTimer.chance}
                        />
                        <ShareGame />
                      </React.Fragment>
                    )}
                    {mapvoting === 'true' && (
                      <PlayGame
                        maps={maps}
                        chats={chats}
                        sendChatMessage={sendChatMessage}
                        message={message}
                        setMessage={setMessage}
                        userid={userid}
                        HandleSend={HandleSend}
                        Exist={Exist}
                        PickMap={PickMap}
                        chance={ChanceTimer.chance}
                        Captain={Captain}
                      />
                    )}
                  </div>
                </React.Fragment>
              ) : (
                <GameFinished
                  userStats={userStats}
                  comment={comment}
                  setComment={setComment}
                  PostComment={PostComment}
                  commentList={commentList}
                  errors={errors}
                />
              )}
            </div>
          )}
          <RightSidebar />
        </div>
      </div>
    </Layout>
  );
};
export default InsideGameFirst;

const TimerAndJoinIpSection = ({
  ChanceTimer,
  Captain,
  cancelled,
  mapvoting,
  joinip,
  Exist,
}) => {
  const { timer, chance } = ChanceTimer;
  const { t } = useTranslation();
  return (
    <div className="ip-server timer-check">
      {!cancelled ? (
        <React.Fragment>
          {joinip ? (
            <React.Fragment>
              {Exist && (
                <h4>
                  {t('hub.ipserver')}: <span>{joinip}</span>{' '}
                  <i
                    onClick={() => {
                      copy(`connect ${joinip}`);
                    }}
                    class="fa fa-clone"
                    aria-hidden="true"
                  ></i>
                </h4>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {Captain ? (
                <React.Fragment>
                  {chance && Captain ? (
                    <h4>
                      {t('hub.pick-a')}{' '}
                      {mapvoting === 'false' ? 'PLAYER' : 'MAP'}{' '}
                      <span>{FormatTimer(timer)}</span>
                    </h4>
                  ) : (
                    <h4>
                      {t('hub.your-opponent')} <span>{t('hub.picking')}</span>
                    </h4>
                  )}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <h4>{t('hub.picking')}...</h4>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <h4 className="cancelled-game">{t('hub.cancelled')}</h4>
      )}
    </div>
  );
};
