/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Router, Route } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import history from './config/history';
import Home from './components/home/home';
import News from './components/news/news';
import NewsDetail from './components/news/newsdetail';

import Hubs from './components/hubs/hubs';
import GameFinished from './components/hubs/gamefinished';
import InsideGameFirst from './components/hubs/insidegamefirst';
import InsideGameSecond from './components/hubs/insidegamesecond';

import MatchMaking from './components/matchmaking/matchmaking';
import MatchMaking1vs1 from './components/matchmaking/matchmaking1vs1';
import MatchMaking5vs5 from './components/matchmaking/matchmaking5vs5';

import Tournament from './components/tournament/tournament';
import TournamentInside from './components/tournament/insidetournament';

import AdminDashboard from './components/admin/admindashboard/dashboard';
import AdminUser from './components/admin/userlist/user';
import AdminChallenge from './components/admin/challenge/challenge';
import AdminCategory from './components/admin/admincategory/category';
import AddNews from './components/admin/admincategory/addnews';
import AdminLogin from './components/admin/adminlogin/login';
import NormalHub from './components/admin/createnormalhub/normalhub';
import NormalHubList from './components/admin/createnormalhub/normalhublist';
import AddMaps from './components/admin/addmaps';
import AddServer from './components/admin/servers';
import MapsList from './components/admin/addmaps/list';
import ServerList from './components/admin/servers/list';
import AllTickets from './components/admin/support';
import AllReports from './components/admin/reporting';
import {
  LoginPrivateRouteAdmin,
  AdminPrivateAfterLogin,
  PrivateRoute,
} from './components/privateroute';
import CheckJoinedPopUp from './components/popups/checkJoined';
import MatchMakingRoom from './components/matchmaking/matchmakingroom';
import Team from './components/team/team';
import TournamentRules from './components/admin/tournamentrules';
import TournamentRoom from './components/tournament/tournamentroom';
import FinishedTournaments from './components/tournament/finishedtournaments';
import ChhalengeComponent from './components/challenges';

// import Support from "./components/support/support";
import Statistics from './components/statistics';
import InsideLadder from './components/ladder/insideladder';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications-component/dist/theme.css';
import Scouting from './components/scouting/index';
import Premium from './components/premium/premium';
import PremiumListing from './components/premium/premiumListing';
import Advance from './components/advance/advance';
import AdvanceListing from './components/advance/advanceListing';
import SectionIncidents from './components/sectionincident/sectionincident';
import {
  queryString,
  Notification,
  GetNormalStatsData1vs1,
  GetNormalStatsData5vs5,
  compareStatsAndAddClasses,
  OrgniseData,
  CreateFakeRequest,
} from './function';
import { UserProvider } from './context/context';
import { userInstance, matchmakingInstance } from './config/axios';
import LadderPage from './components/ladder';
import LadderRoom from './components/ladder/ladderroom';
import Loader from './components/loader/loader';
import AllWithdrawRequest from './components/admin/withdrawrequest';
import MyProfile from './components/myprofile';
import {
  socket,
  GetNotifications,
  GetNotifiyQueueFind,
  CheckJoinedStatus,
  LeaveGroup as LeaveAndJoinGroup,
  GetNotifyEventTournament,
} from './socket';
import Store from './components/store/store';
import ProductStore from './components/admin/store';
import AddProduct from './components/admin/store/addproduct';
import CategoryStore from './components/admin/store/category';
import AddCategory from './components/admin/store/addcategory';
import PurchaseItems from './components/admin/store/purchase-items';

import TournamentList from './components/admin/tournament';
import Addtournament from './components/admin/tournament/addtournament';
import Profile from './components/profile/profile';
import './responsive.css';
import PlayerDetail from './components/profile/playerDetail';

const App = () => {
  const initial1vs1AgainstUserStats = [
    { loss: 0, class: 'no' },
    { win: 0, class: 'no' },
    { draw: 0, class: 'no' },
    { kills: 0, class: 'no' },
    { death: 0, class: 'no' },
    { KDR: 0, class: 'no' },
    { headshot_per: 0, class: 'no' },
    { KR: 0, class: 'no' },
    { winpercent: 0, class: 'no' },
    { totalgames: 0, class: 'no' },
    { streaks: 0, class: 'no' },
  ];
  const initialOpponentStats = {
    prestige: 1000,
    prestige1vs1: 1000,
    useravatar: '',
    username: 'Player name',
    ispremium: false,
    ispremiumadvnaced: false,
  };
  const [isLogin, setIsLogin] = useState(localStorage.getItem('webtoken'));
  const [userDetails, setUserDetails] = useState({});
  const [checkJoined, setCheckJoined] = useState({
    timer: 0,
    show: false,
    teamArray: [],
  });
  const [readyPlayer, setReady] = useState(false);
  const [distributedStats, setDistributedStats] = useState([]);
  const [padLock, setPadLock] = useState(false);
  const [userStats, setUserStats] = useState([]);
  const [opponentStats, setOpponentStats] = useState(
    initial1vs1AgainstUserStats
  );
  const [selectedGame, setSelectedGame] = useState('1vs1');
  const [opponentStatsObject, setOpponentObject] =
    useState(initialOpponentStats);
  const [menutoggle, setMenuToggle] = useState(true);
  const [globalLoader, setGlobalLoader] = useState(false);

  useEffect(() => {
    const { steamlogin, authtoken, verify, inviteid } = queryString();
    if (steamlogin && authtoken) {
      localStorage.setItem('webtoken', authtoken);
      //history.go(-2);
      setIsLogin(true);
      CallInvite();
      window.history.pushState('page1', 'title', '/');
    }
    if (verify === 'success') {
      Notification('success', 'Email verified successfully');
      window.history.pushState('page1', 'title', '/');
    } else if (verify === 'alreadyverified') {
      Notification('danger', 'Email already verified');
      window.history.pushState('page1', 'title', '/');
    }
    checkId(inviteid);
    GetNotifications(() => {
      checkIsAuth();
    });
    StartLoader();

    GetNotifiyQueueFind((data) => {
      const { roomid } = data;
      localStorage.setItem('^R4TR$3ER', roomid);
      socket.emit('join', roomid);
    });

    CheckJoinedStatus((data) => {
      const { status, timer, teamArray, gamemode } = data;
      const removeEncoded =
        gamemode === '5vs5' ? 'r_encoded_q^' : 'r_encoded_q^11';
      if (status === 'NotAllAccepted') {
        let myid = localStorage.getItem('userid');
        setCheckJoined({ timer, show: true, teamArray });
        const checkIsReady = teamArray.filter(
          (el) => el.userid._id === myid && el.ready
        );
        if (checkIsReady.length > 0) {
          setReady(true);
        } else {
          setReady(false);
        }
      } else if (status === 'AllAccepted') {
        setCheckJoined({ timer: 0, show: false });
        const id = localStorage.getItem('^R4TR$3ER');
        history.push(`/matchmakingroom/?id=${id}`);
        localStorage.removeItem('^R4TR$3ER');
        localStorage.removeItem(removeEncoded);
        // localStorage.removeItem("r_encoded_q^");
      } else if (status === 'MissingAcceptAll') {
        setCheckJoined({ timer: 0, show: false });
        localStorage.removeItem('^R4TR$3ER');
        localStorage.removeItem(removeEncoded);
        // localStorage.removeItem("r_encoded_q^");
      }
    });

    LeaveAndJoinGroup(() => {
      checkIsAuth();
    });
    // GetNotifyEventTournament((tournaId) => {
    //     localStorage.setItem("t_tab_key", "registration");
    //     history.push(`/inside-tournaments/?tid=${tournaId}`);
    //     // Get notify event for the user there tournament is going to be start
    //     // history.push(`/inside-tournaments/?tid=${tournaId}`);
    //     // console.log("yes i am able to listen", tournaId);
    // });

    checkIsAuth();
    GetRequiredDataOnThePages();
  }, []);
  const ClosedTickets = (postedTicketsData) => {
    return postedTicketsData.filter((el) => el.status === 'close');
  };
  const AnsweredTickets = (postedTicketsData) => {
    return postedTicketsData.filter(
      (el) => el.replies && el.replies.length > 0
    );
  };

  //This function is used for check user authentication is valid or not ,if its valid
  //we get details of the user and store details in the context api for access on othre components where the details are needed
  const checkIsAuth = async () => {
    try {
      if (localStorage.getItem('webtoken')) {
        const response = await userInstance().get('/checkauth');
        let { code, userdata, getUserStats1vs1, getUserStats5vs5 } =
          response.data;
        if (code === 200) {
          // console.log(GetNormalStatsData5vs5(getUserStats5vs5));
          // console.log(GetNormalStatsData1vs1(getUserStats1vs1));
          let {
            notification,
            _id,
            friends,
            group,
            ispremium,
            ispremiumadvnaced,
            postedtickets,
            transaction,
            withdrawRequests,
          } = userdata;
          let unseen = notification.filter((el) => !el.seen);
          userdata.unseen = unseen;
          friends = friends ? friends : [];
          postedtickets = postedtickets ? postedtickets : [];
          //Here we get online friends
          let onlinefriends = friends
            .filter((el) => el.bothfriends[0].online)
            .map((el) => el.bothfriends[0]);
          const { members } = group ? group : { members: [] };
          const groupJoinedLength = members
            .filter((el) => el.user)
            .map((el) => el.user);
          onlinefriends = onlinefriends.map((el) => {
            const checkExist = groupJoinedLength.filter(
              (ele) => ele._id === el._id || el.group
            );
            if (checkExist.length > 0) {
              el.ingroup = true;
              return el;
            } else {
              el.ingroup = false;
              return el;
            }
          });
          userdata.onlinefriends = onlinefriends;
          userdata.groupJoinedLength = groupJoinedLength;
          //Orgnise data
          let transactions = OrgniseData(transaction, withdrawRequests);

          userdata.transactions = transactions ? transactions : [];
          userdata.userStats5vs5 = GetNormalStatsData5vs5(getUserStats5vs5);
          userdata.userStats1vs1 = GetNormalStatsData1vs1(getUserStats1vs1);
          userdata.closedTickets = ClosedTickets(postedtickets);
          userdata.answeredTickets = AnsweredTickets(postedtickets);
          setUserStats(GetNormalStatsData1vs1(getUserStats1vs1));
          setPadLock(ispremium || ispremiumadvnaced ? true : false);
          //This socket join method is used for notification events
          setUserDetails(userdata);
          socket.emit('join', _id.toString());
          localStorage.setItem('userid', _id);
        } else {
          localStorage.removeItem('webtoken');
          setIsLogin(false);
        }
      }
    } catch (e) {
      console.log('Error in check auth function', e);
      return e;
    }
  };

  const checkId = (inviteid) => {
    if (inviteid && inviteid.match(/^[0-9a-fA-F]{24}$/)) {
      localStorage.setItem('inviteid', inviteid);
    }
  };

  //This function is used for connect players
  const CallInvite = async () => {
    try {
      let id = localStorage.getItem('inviteid');
      if (id) {
        const response = await userInstance().patch(`/connectwithlink/${id}`);
        const {
          data: { code },
        } = response;
        if (code === 200) {
          localStorage.removeItem('inviteid');
        } else {
          localStorage.removeItem('inviteid');
        }
      }
    } catch (e) {
      return e;
    }
  };

  const AcceptReady = async () => {
    try {
      const roomid = localStorage.getItem('^R4TR$3ER');
      const response = await matchmakingInstance().patch(`/setready/${roomid}`);
      const {
        data: { code },
      } = response;
      if (code === 200) {
        setReady(false);
      }
    } catch (e) {
      return e;
    }
  };

  const RemoveFromGroup = async (playerid) => {
    try {
      const { group } = userDetails;
      const { _id } = group ? group : {};
      if (_id) {
        const response = await userInstance().put(
          `/removefromgroup/${_id}/${playerid}`
        );
        const {
          data: { code, msg },
        } = response;
        if (code === 200) {
          Notification('success', msg);
        } else {
          Notification('danger', msg);
        }
      }
    } catch (error) {
      return error;
    }
  };

  const GetRequiredDataOnThePages = async () => {
    try {
      const response = await userInstance().get('/getrequireddata');
      const {
        data: { code, requireddata },
      } = response;
      if (code === 200) {
        setDistributedStats(requireddata ? requireddata : {});
      }
    } catch (error) {
      return error;
    }
  };

  // Select for stats compare

  const selectForCompare = async (playeridd) => {
    try {
      const response = await userInstance().get(
        `/getStatsCompare/${playeridd}/${selectedGame}`
      );
      const {
        data: { code, msg, getUserStats, playerData },
      } = response;
      if (code === 200) {
        const objectData = playerData ? playerData : initialOpponentStats;
        const { userStats1vs1, userStats5vs5 } = userDetails;
        const statsOpponent =
          selectedGame === '1vs1'
            ? GetNormalStatsData1vs1(getUserStats)
            : GetNormalStatsData5vs5(getUserStats);
        const statsCurrent =
          selectedGame === '1vs1' ? userStats1vs1 : userStats5vs5;
        const { currentStats, opponentStats } = compareStatsAndAddClasses(
          statsCurrent,
          statsOpponent
        );
        setOpponentStats(opponentStats);
        setUserStats(currentStats);
        setOpponentObject(objectData);
      } else {
        Notification('danger', msg);
      }
    } catch (error) {
      return error;
    }
  };

  const ContactWithUser = async (payload) => {
    try {
      const response = await userInstance().post('/contactWithUser', payload);
      const {
        data: { code, msg },
      } = response;
      if (code === 200) {
        Notification('success', msg);
      } else {
        Notification('danger', msg);
      }
    } catch (error) {
      return error;
    }
  };

  const StartLoader = async () => {
    setGlobalLoader(true);
    await CreateFakeRequest();
    setGlobalLoader(false);
  };

  // Context store !
  const user = {
    loggedIn: isLogin,
    setIsLogin: setIsLogin,
    userDetails: userDetails,
    setUserDetails: setUserDetails,
    CallInvite: CallInvite,
    RemoveFromGroup: RemoveFromGroup,
    distributedStats,
    setDistributedStats,
    padLock,
    userStats,
    selectedGame,
    selectForCompare,
    opponentStats,
    setSelectedGame,
    opponentStatsObject,
    menutoggle,
    setMenuToggle,
    ContactWithUser,
    globalLoader,
    setGlobalLoader,
    checkIsAuth,
  };
  return (
    <div className="App">
      <Router history={history}>
        <ReactNotification />
        <UserProvider value={user}>
          <Route exact path="/" render={() => <Home isLogin={isLogin} />} />
          <Route exact path="/news" render={() => <News />} />
          <Route exact path="/newsdetail" render={() => <NewsDetail />} />
          <Route exact path="/hubs" render={() => <Hubs />} />
          <Route exact path="/gamefinished" render={() => <GameFinished />} />
          <Route
            exact
            path="/insidegamefirst"
            render={() => <InsideGameFirst />}
          />
          <Route
            exact
            path="/insidegamesecond"
            render={() => <InsideGameSecond />}
          />
          <Route exact path="/matchmaking" render={() => <MatchMaking />} />
          <Route
            exact
            path="/matchmaking1vs1"
            render={() => <MatchMaking1vs1 />}
          />
          <Route
            exact
            path="/matchmaking5vs5"
            render={() => <MatchMaking5vs5 />}
          />
          <Route exact path="/tournaments" render={() => <Tournament />} />
          <Route
            exact
            path="/inside-tournaments"
            render={() => <TournamentInside />}
          />
          <Route
            exact
            path="/matchmakingroom"
            render={() => <MatchMakingRoom />}
          />
          <Route exact path="/teamdetails" render={() => <Team />} />
          <Route exact path="/ladder" render={() => <LadderPage />} />
          <Route exact path="/insideLadder" render={() => <InsideLadder />} />
          <Route exact path="/scoutingarea" render={() => <Scouting />} />
          <Route exact path="/premium" render={() => <Premium />} />
          <Route exact path="/advance" render={() => <Advance />} />
          <Route
            exact
            path="/sectionincident"
            render={() => <SectionIncidents />}
          />
          <Route
            exact
            path="/premiumlisting"
            render={() => <PremiumListing />}
          />
          <Route
            exact
            path="/advancelisting"
            render={() => <AdvanceListing />}
          />
          <Route
            exact
            path="/tournamentroom"
            render={() => <TournamentRoom />}
          />
          <Route exact path="/store" render={() => <Store />} />
          <Route exact path="/profile" render={() => <Profile />} />
          <Route exact path="/socialpage" render={() => <PlayerDetail />} />
          <PrivateRoute exact path="/myprofile" component={MyProfile} />

          <PrivateRoute exact path="/statistics" component={Statistics} />
          {/* <PrivateRoute exact path="/support" component={Support} /> */}
          <PrivateRoute
            exact
            path="/editchallenge"
            component={ChhalengeComponent}
          />
          <PrivateRoute exact path="/ladderroom" component={LadderRoom} />
          <Route
            exact
            path="/finished-tournaments"
            render={() => <FinishedTournaments />}
          />
          <LoginPrivateRouteAdmin exact path="/admin" component={AdminLogin} />
          <AdminPrivateAfterLogin
            exact
            path="/admin/dashboard"
            component={AdminDashboard}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/user"
            component={AdminUser}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/challenge"
            component={AdminChallenge}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/category"
            component={AdminCategory}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/addnews"
            component={AddNews}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/addhubs"
            component={NormalHub}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/hubslist"
            component={NormalHubList}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/addmaps"
            component={AddMaps}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/maps"
            component={MapsList}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/addserver"
            component={AddServer}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/serverslist"
            component={ServerList}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/tournament-rules"
            component={TournamentRules}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/supporttickets"
            component={AllTickets}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/withdrawrequest"
            component={AllWithdrawRequest}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/reports"
            component={AllReports}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/store"
            component={ProductStore}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/addproduct"
            component={AddProduct}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/store/category"
            component={CategoryStore}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/store/addcategory"
            component={AddCategory}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/purchase-items"
            component={PurchaseItems}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/tournament"
            component={TournamentList}
          />
          <AdminPrivateAfterLogin
            exact
            path="/admin/add-tournament"
            component={Addtournament}
          />
        </UserProvider>
      </Router>
      {checkJoined.show && (
        <CheckJoinedPopUp
          show={checkJoined.show}
          handleClose={() => {}}
          timer={checkJoined.timer}
          teamArray={checkJoined.teamArray}
          readyPlayer={readyPlayer}
          AcceptReady={AcceptReady}
        />
      )}
      {globalLoader && <Loader />}
    </div>
  );
};
export default App;
