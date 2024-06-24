import React, { useEffect, useState } from "react";
import copy from "copy-to-clipboard";
import "../hubs/hubs.css";
import Layout from "../layout/layout";
import LeftSidebar from "../sidebar/leftsidebar";
import RightSidebar from "../sidebar/rightsidebar";
import Teams from "../hubs/teams";
// import Chat from "./chat";
// import ShareGame from "./sharegame";
import PlayGame from "../hubs/playgame";
import GameFinished from '../hubs/gamefinished';
import { tournamentInstance } from '../../config/axios';
import { queryString, Notification, FormatTimer } from "../../function";
// import history from "../../config/history";
import { socket, GetHubsChat, PlayerPickTimer, HubGameCancelled, PickMapEvent, SetHubsIP, ResetRoom, GetMapVotingStart } from "../../socket";
import { validateComment, CalculateStats } from "../../function";
const TournamentRoom = () => {
    const [message, setMessage] = useState('');
    const [userid, setUserId] = useState('');
    const [chats, setChats] = useState({ teamone: [], teamtwo: [] });
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
    const [teamname, setTeamName] = useState("");
    const [tournamentid, setTournamentId] = useState('');
    // This state is used to set ready for the player - 
    const [Ready, setReadyTeam] = useState(false);
    useEffect(() => {
        TournamentRoomData();
        //This event is used to get real time chat message
        GetHubsChat(({ messages, team }) => {
            try {
                setChats((preState) => {
                    return { ...preState, [team]: [...preState[team], messages] }
                });
                document.querySelector(".chat-list:last-child").scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            } catch (e) {
                return 0;
            }
        });

        // this function for PlayerPickTimer 
        PlayerPickTimer((data) => {
            console.log("data", data);
            const userlocalid = localStorage.getItem('userid');
            if (data.playerid === userlocalid) {
                setChanceTimer({ timer: data.timer, chance: true });
            } else {
                setChanceTimer({ timer: data.timer, chance: false });
            }
        });

        //This socket event will when game cancelled
        // HubGameCancelled(() => {
        //     Notification('danger', 'Game cannceled due to inactivety at the time map ban');
        //     history.push("/matchmaking");
        // });
        // This function is used to get captains picked map in real time
        PickMapEvent((mapname) => {
            setMaps(preState => setMapsFunction(preState, mapname))
        });
        //In this event we set server ip where all things are configured
        SetHubsIP((ip) => {
            setJoinIp(ip.ip)
            setChanceTimer({ timer: 60, chance: false });
        });
        //In this event we setup all the things
        ResetRoom(() => {
            TournamentRoomData();
        })
        //GetMapVotingStart
        GetMapVotingStart(() => {
            setMapvoting('true');
            setReadyTeam(true);
        })
        const setMapsFunction = (preState, mapname) => {
            preState.forEach(element => {
                if (element.title === mapname) {
                    element.open = false;
                }
            });
            return preState;
        }
    }, []);
    const TournamentRoomData = async () => {
        try {
            const { id } = queryString();
            if (id) {
                const { data: { code, tournamentRoomData: { teamone, teamtwo, team1, team2, maps, running, cancelled, mapvoting, joinip, comments, gamemode, tournamentid }, userid } } = await tournamentInstance().get(`/tournamentRoomData/${id}`);
                if (code === 200) {
                    setUserId(userid);
                    setRunning(running);
                    const teamname = teamone ? "teamone" : "teamtwo";
                    setChats({ teamone: teamone ? teamone : [], teamtwo: teamtwo ? teamtwo : [] });
                    setTeamName(teamname);
                    setMaps(maps);
                    setCheckfull('true');
                    setCancelled(cancelled);
                    setMapvoting(mapvoting);
                    setJoinIp(joinip);
                    setCommentList(comments);
                    checkExistInHub(team1, team2, userid);
                    // console.log('tournamentid', tournamentid);
                    setTournamentId(tournamentid)
                    setReadyTeam(mapvoting === 'true' ? true : false);
                    if (team1.length > 0 && team2.length > 0) {
                        checkCaptain(team1, team2, userid);
                        if (!running) {
                            const calculateMvpAll = CalculateStats(team1, team2, gamemode);
                            setUserStats(calculateMvpAll);
                            let firstteam = calculateMvpAll.filter(el => el.type === 'team1' && el.iscaptain);
                            let secondteam = calculateMvpAll.filter(el => el.type === 'team2' && el.iscaptain);
                            if (firstteam.length && secondteam.length) {
                                setBothState({ team1: firstteam[0].score, team2: secondteam[0].score });
                            }
                        }
                    }
                    setDataLoad(true);
                    ScrollChat([1, 2]);
                }
                socket.emit('join', id);
            }
        } catch (e) {
            return 0;
        }
    }
    const sendChatMessage = () => {
        const { id: roomid } = queryString();
        const token = localStorage.getItem('webtoken');
        const payload = { token, message, roomid };
        if (token && roomid && message) {
            socket.emit('MatchMakingRoomChat', payload);
            setMessage('');
        }
    }
    const HandleSend = (e) => {
        if (e.charCode === 13) {
            sendChatMessage();
        }
    }
    const checkCaptain = (team1, team2, userid) => {
        const BothTeams = [...team1, ...team2];
        const CheckFromBoth = BothTeams.filter(el => el.iscaptain && el.userid._id === userid);
        const CheckBothCaptains = BothTeams.filter(el => el.iscaptain);
        team1 = team1.filter(el => !el.iscaptain);
        team2 = team2.filter(el => !el.iscaptain);
        if (CheckFromBoth.length > 0) {
            setCaptain(true);
        }
        setTeam1(team1);
        setTeam2(team2);
        setBothCaptain(CheckBothCaptains);
    }

    const ScrollChat = (chat) => {
        try {
            if (chat.length > 0) {
                document.querySelector(".chat-list:last-child").scrollIntoView({
                    behavior: "smooth", block: 'nearest', inline: 'start'
                });
            }
        } catch (e) {
            return 0;
        }
    }
    const checkExistInHub = (team1, team2, userid) => {
        const FullArray = [...team1, ...team2];
        const FilterIfExist = FullArray.filter(el => el.userid._id === userid);
        if (FilterIfExist.length > 0) {
            setExist(true);
        }
    }

    const PickMap = async (mapname) => {
        const { id: roomid } = queryString();
        if (roomid) {
            const payload = { mapname, roomid }
            await tournamentInstance().put('/tournamentMapVote', payload);
        }
    }
    const PostComment = async (e) => {
        try {
            e.preventDefault();
            const { isValid, errors } = validateComment({ comment });
            setErrors(errors);
            if (!isValid) {
                return;
            }
            const { id: roomid } = queryString();
            const response = await tournamentInstance().post('/postComment', { comment, roomid });
            const { data: { code, saveComment, msg } } = response;
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
    }

    // This function is used to 
    const SetReady = async () => {
        try {
            const { id: roomid } = queryString();
            if (tournamentid && roomid) {
                const response = await tournamentInstance().post(`/setRaedy/${roomid}/${tournamentid}`);
                const { data: { code, msg } } = response;
                if (code === 200) {
                    Notification('success', msg);
                } else {
                    Notification('danger', msg);
                }
            }
        } catch (error) {
            return error;
        }
    }

    return (
        <Layout header={true} footer={true}>
            <div className="game-finished-page">
                <div className="main-wrapper">
                    <LeftSidebar mainmenu={true} increase={true} community={true} voiceserver={true} />
                    {dataLoad && <div className="middle-wrapper">
                        <div className="game-finished-top-section">
                            <Teams name={'Tournament room'} checkfull={checkfull} team1={team1} team2={team2} running={running} HandleJoin={() => { }} BothTeamsData={BothCaptain} ChanceTimer={ChanceTimer} Exist={Exist} ScoreBoth={ScoreBoth} HandleExist={() => { }} />
                        </div>
                        {running ? <React.Fragment>
                            {checkfull === 'true' && <TimerAndJoinIpSection ChanceTimer={ChanceTimer} Captain={Captain} cancelled={cancelled} mapvoting={mapvoting} joinip={joinip} Exist={Exist} Ready={Ready} SetReady={SetReady} />}
                            <div className="game-finished-content">
                                {mapvoting === 'true' && <PlayGame maps={maps} chats={chats[teamname]} sendChatMessage={sendChatMessage} message={message} setMessage={setMessage} userid={userid} HandleSend={HandleSend} Exist={Exist} PickMap={PickMap} chance={ChanceTimer.chance} Captain={Captain} />}
                            </div>
                        </React.Fragment> : <GameFinished userStats={userStats} comment={comment} setComment={setComment} PostComment={PostComment} commentList={commentList} errors={errors} />}
                    </div>}
                    <RightSidebar />
                </div>
            </div>
        </Layout>
    );
};
export default TournamentRoom;

const TimerAndJoinIpSection = ({ ChanceTimer, Captain, cancelled, mapvoting, joinip, Exist, Ready, SetReady }) => {
    const { timer, chance } = ChanceTimer;
    return <div className="ip-server timer-check">
        {!Ready && mapvoting === 'false' ? <div className='join-ready-btn'><button className="join-btn" onClick={() => SetReady()} >Ready</button></div> : <React.Fragment>
            {!cancelled ? <React.Fragment>
                {joinip ? <React.Fragment>
                    {Exist && <h4>IP SERVER: <span>{joinip}</span> <i onClick={() => {
                        copy(`connect ${joinip}`)
                    }} class="fa fa-clone" aria-hidden="true"></i></h4>}
                </React.Fragment> : <React.Fragment>
                        {Captain ? <React.Fragment>
                            {chance && Captain ? <h4>PICK A {mapvoting === 'false' ? 'PLAYER' : 'MAP'} <span>{FormatTimer(timer)}</span></h4> : <h4>YOUR OPPONENT <span>PICKING</span></h4>}
                        </React.Fragment> : <React.Fragment>
                                <h4>PICKING...</h4>
                            </React.Fragment>}
                    </React.Fragment>}
            </React.Fragment> : <h4 className='cancelled-game'>CANCELLED</h4>}
        </React.Fragment>}

    </div>
}

