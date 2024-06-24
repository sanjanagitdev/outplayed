import React, { useEffect, useState, useContext } from "react";
import history from "../../config/history";
import "./tournament.css";
import Layout from "../layout/layout"
import { Tab } from "react-bootstrap";
import Tabs from 'react-bootstrap/Tabs';
import MatchMakingTeam from "../popups/matchmakingteam";
import { tournamentInstance } from "../../config/axios";
import { queryString, Notification, checkPlayersStatus, GetCheckIn } from "../../function";
import UserContext from '../../context/context';
import TournamentSummary from './summary';
import TournamentRegistration from './registration';
import TournamentRules from './rules';
import TournamentBrakets from './brackets';
import TournamentTestBrakets from "./testBracket";
import Reward from "./reward";
import { TournamentEvents } from "../../socket";
const TournamentInside = () => {
    const { userDetails: { teams }, loggedIn } = useContext(UserContext);
    const [tournamentData, setTournamentData] = useState({});
    const [showteam, setShowTeam] = useState(false);
    const [errors, setErrors] = useState({});
    const [key, setKey] = useState(localStorage.getItem('t_tab_key') ? localStorage.getItem('t_tab_key') : 'summary');
    const [tournamentRules, setTournamentRules] = useState([]);
    const [BracketData, setBracketData] = useState([]);
    const [isExist, setExist] = useState(false);
    const [isCheckIn, setIsCheckIn] = useState(false);
    const [skip, setSkip] = useState(1);
    const [limit, setLimit] = useState(6);
    const [isReadyOpen, setIsReadyOpen] = useState(true);
    const LevelsArray = [
        "roomsLevelOne",
        "roomsLevelTwo",
        "roomsLevelThree",
        "roomsLevelFour",
        "roomsLevelFive",
        "roomsLevelSix",
    ];

    const nextPage = () => {
        setSkip(skip + limit);
        setLimit(preState => preState + 6)
    }

    const changePage = (direction) => {
        if (direction == 'back') {
            setSkip(preState => preState - 1)
        } else if (direction == 'next') {
            setSkip(preState => preState + 1)
        }
    }
    const previousPage = () => {
        setSkip(skip - limit)
        setLimit(preState => preState - 6)
    }

    const TournamentData = async () => {
        try {
            const { tid } = queryString();
            if (tid) {
                const response = await tournamentInstance().get(`/gettournaments/${tid}`);
                let { data: { code, tournamentData, tournamentRules, TournamentDataForBrackets } } = response;
                if (code === 200) {
                    const { playerJoined, checkedInPlayers } = tournamentData;
                    let Players = [];
                    playerJoined.forEach(element => {
                        if (element.UserOrTeam && element.onModel === 'users') {
                            Players.push(element.UserOrTeam);
                        } else if (element.UserOrTeam && element.onModel === 'team') {
                            Players = [...Players, ...element.UserOrTeam.joinedmembers];
                        }
                    });

                    tournamentData.Players = GetCheckIn(checkedInPlayers, Players);
                    ExistCheck(Players);
                    CheckInCheck(checkedInPlayers);
                    setTournamentData(tournamentData);
                    setTournamentRules(tournamentRules);
                    setBracketData(TournamentDataForBrackets);



                }
            }
        } catch (error) {
            return error;
        }
    }
    useEffect(() => {
        TournamentData();
        TournamentEvents(() => {
            TournamentData();
        })
    }, []);
    const handleCloseTeam = () => {
        if (loggedIn) {
            setShowTeam(!showteam)
        } else {
            Notification('danger', 'Please try to login and then try to join the tournament !!')
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
            CallJoin(teamid);
        }
    }
    const CallJoin = async (teamid) => {
        const { tid } = queryString();
        if (tid) {
            const payload = { teamid, tid }
            const response = await tournamentInstance().post('/joinTournament', payload);
            const { data: { code, msg, errors } } = response;
            if (code === 200) {
                Notification('success', msg);
                setShowTeam(false);
                setErrors({});
                //TournamentData();
            } else if (code === 201) {
                if (!showteam) {
                    Notification('danger', Object.values(errors)[0]);
                } else {
                    setErrors(errors);
                }
            } else {
                Notification('danger', msg);
            }
        }
    }
    const selectTab = (key) => {
        localStorage.setItem('t_tab_key', key)
        setKey(key);
    }
    const ExistCheck = (players) => {
        const isValid = players.filter(el => el._id === localStorage.getItem('userid'));
        if (isValid.length > 0) {
            setExist(true);
        }
    }
    const CheckInCheck = (checkedInPlayers) => {
        const isValid = checkedInPlayers.filter(el => el._id === localStorage.getItem('userid'));
        if (isValid.length > 0) {
            setIsCheckIn(true);
        }
    }
    const CheckInTournament = async () => {
        const { tid } = queryString();
        if (tid) {
            const response = await tournamentInstance().patch(`/checkInTournament/${tid}`);
            const { data: { code, msg, errors } } = response;
            if (code === 200) {
                Notification('success', msg);
                // TournamentData();
            } else if (code === 201) {
                Notification('danger', Object.values(errors)[0]);
            } else {
                Notification('danger', msg);
            }
        }
    }
    const SeeMyStatus = () => {
        let { Players } = { ...tournamentData };
        Players.forEach(element => {
            if (element._id === localStorage.getItem('userid')) {
                element.isStatus = true;
            }
        });
        setTournamentData({ ...tournamentData, Players })
    }
    const GoToTheRoom = async () => {
        try {
            const { tid } = queryString();
            if (tid) {
                const response = await tournamentInstance().post(`/goToTheRoom/${tid}`);
                const { data: { code, msg, roomid } } = response;
                if (code === 200) {
                    history.push(`/tournamentroom/?id=${roomid}`);
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
            <div className="tournament-inside">
                <div className="main-wrapper">
                    <div className="middle-wrapper">
                        <div className="tournament-tabs">
                            <Tabs defaultActiveKey={key} id="uncontrolled-tab-example" onSelect={(key) => selectTab(key)}>
                                <Tab eventKey="summary" title="Summary">
                                    <TournamentSummary tournamentData={tournamentData} />
                                </Tab>
                                <Tab eventKey="rewards" title="Rewards">
                                    <Reward tournamentData={tournamentData} />
                                </Tab>
                                <Tab eventKey="brackets" title="Brackets">
                                    <TournamentTestBrakets tournamentData={tournamentData} BracketData={BracketData} LevelsArray={LevelsArray} />
                                    {/* <TournamentBrakets tournamentData={tournamentData} /> */}
                                </Tab>
                                <Tab eventKey="registration" title="Registration">
                                    <TournamentRegistration tournamentData={tournamentData} handleCloseTeam={handleCloseTeam} CallJoin={CallJoin} isExist={isExist} CheckInTournament={CheckInTournament} isCheckIn={isCheckIn} SeeMyStatus={SeeMyStatus} skip={skip} limit={limit} nextPage={nextPage} previousPage={previousPage} changePage={changePage} />
                                </Tab>
                                <Tab eventKey="rules" title="Rules">
                                    <TournamentRules tournamentRules={tournamentRules} />
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                    {showteam && <MatchMakingTeam show={showteam} handleClose={handleCloseTeam} teams={teams} handleShow={() => { }} RedirectWithTeam={JoinWithTeam} errors={errors} />}
                </div>
            </div>
            {!tournamentData.tournamentEnd && <React.Fragment>
                {tournamentData.tournamentStarted && isExist && <IsReadyComponent isReadyOpen={isReadyOpen} setIsReadyOpen={setIsReadyOpen} GoToTheRoom={GoToTheRoom} />}
            </React.Fragment>}
        </Layout>
    );
};
export default TournamentInside;


const IsReadyComponent = ({ isReadyOpen, setIsReadyOpen, GoToTheRoom }) => {
    return <div className="tournament-match">
        <i class="fa fa-times" aria-hidden="true" onClick={() => setIsReadyOpen(!isReadyOpen)}></i>
        <h6>Tournament Match is Ready!</h6>
        <p>Come on and join</p>
        <button onClick={() => GoToTheRoom()}>Join</button>
    </div>
}


