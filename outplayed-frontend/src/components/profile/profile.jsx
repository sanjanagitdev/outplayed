/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useContext } from 'react';
import Helmet from 'react-helmet';
import { Tabs, Tab } from 'react-bootstrap';
import ProfileTop from './profileTop';
import Layout from '../layout/layout';
import Friends from './generalDescription';
import AdvanceStatistics from './advanceStatisctics';
import './profile.css';
import LastMatches from './lastMatches';
import Tournaments from './tournaments';
import ProfileInfo from './profileInfo';
import Streaming from './streaming';
import Signature from './signatureBook';
import SocailPost from './postComponent';
import { UserProvider } from '../../context/profilecontext';
import UserContext from '../../context/context';
import { userInstance } from './../../config/axios';
import {
  queryString,
  Notification,
  GetNormalStatsData1vs1,
  GetNormalStatsData5vs5,
  groupBy,
  FriendsData,
} from './../../function/index';
import { socket, GetCommentData, GetCommentDataOff } from '../../socket';

const Profile = () => {
  const { userDetails, checkIsAuth } = useContext(UserContext);

  const initialModeState = {
    gamesplayed: 0,
    winrate: 0,
    longestwinstreak: 0,
    recentresults: [],
    kd: 0,
    headshotsper: 0,
  };

  const initialFriendsData = {
    friends: [],
    commanFriends: [],
    friendsCopy: [],
    commanFriendsCopy: [],
  };
  const [profileData, setProfileData] = useState({});
  const [tournaments, setTournaments] = useState([]);
  const [lastResults, setResults] = useState([]);
  const [StatsOne, setStatsOne] = useState([]);
  const [StatsFive, setStatsFive] = useState([]);
  const [signatureBook, setSignatureBook] = useState('');
  const [commenttext, setComment] = useState(null);
  const [selectedType, setSelectedType] = useState('1vs1');
  const [selectedModeData, setSelectedModeData] = useState(initialModeState);
  const [mostPlayedMaps, setMostPlayedMaps] = useState([]);
  const [posts, setPosts] = useState([]);
  const [firiendsData, setCommanFriends] = useState(initialFriendsData);

  const oldDataRef = useRef(posts);

  useEffect(() => {
    oldDataRef.current = posts;
  });

  useEffect(() => {
    const handler = (message) => {
      messageHandler(message, oldDataRef.current, setPosts);
    };
    GetCommentData(handler);

    return () => {
      GetCommentDataOff(handler);
    };
  }, []);

  const messageHandler = (message, oldData, setPosts) => {
    let oldState = [...oldData];

    oldState.forEach((el) => {
      const { postid, getCommentData } = message;
      if (el._id === postid) {
        el.comments.push(getCommentData);
      }
    });
    setPosts(oldState);
  };

  const CalculateMostPlayedMaps = (lastmatchData) => {
    lastmatchData = [...lastmatchData];
    const MostMapPlayed = lastmatchData.map((el) => {
      el.mapname = el.maps.title;
      return el;
    });

    const groupedMaps = groupBy(MostMapPlayed, 'mapname').sort(
      (a, b) => b.length - a.length
    );

    setMostPlayedMaps(groupedMaps);
  };

  const getUserData = async () => {
    try {
      const { id } = queryString();
      if (!id) {
        return;
      }
      const response = await userInstance().get(`/FetchPlayerData/${id}`);
      const {
        data: {
          code,
          userdata,
          JoinedTournaments,
          lastMatches,
          getUserStats1vs1,
          getUserStats5vs5,
        },
      } = response;
      if (code === 200) {
        setProfileData(userdata);
        setTournaments(JoinedTournaments);
        setResults(lastMatches);
        setPosts(userdata.posts ? userdata.posts : []);
        setStatsOne(getUserStats1vs1);
        setStatsFive(getUserStats5vs5);
        CalculateMostPlayedMaps(lastMatches);
      }
    } catch (error) {
      return error;
    }
  };

  const acceptRequest = async (senderid) => {
    try {
      const response = await userInstance().post(`/acceptRequest`, {
        _id: senderid,
      });
      const {
        data: { code, msg },
      } = response;
      if (code === 200) {
        Notification('success', msg);
        checkIsAuth();
        getUserData();
      } else {
        Notification('danger', msg);
      }
    } catch (error) {
      return error;
    }
  };
  const rejectRequest = async (senderid) => {
    try {
      const response = await userInstance().post(`/rejectRequest`, {
        _id: senderid,
      });
      const {
        data: { code, msg },
      } = response;
      if (code === 200) {
        Notification('success', msg);
        checkIsAuth();
        getUserData();
      } else {
        Notification('danger', msg);
      }
    } catch (error) {
      return error;
    }
  };

  const sendRequests = async (senttoid) => {
    try {
      const response = await userInstance().post(`/sendRequest`, {
        _id: senttoid,
      });
      const {
        data: { code, msg },
      } = response;

      if (code === 200) {
        Notification('success', msg);
        checkIsAuth();
        getUserData();
      } else {
        Notification('danger', msg);
      }
    } catch (error) {
      return error;
    }
  };
  const followUser = async (id) => {
    try {
      const response = await userInstance().put(`/follow/${id}`);
      const {
        data: { code, msg },
      } = response;
      if (code === 200) {
        Notification('success', msg);
        checkIsAuth();
        getUserData();
      } else {
        Notification('danger', msg);
      }
    } catch (error) {
      return error;
    }
  };

  const handleSignatureBook = (e) => {
    //HandleSignatureBook
    const {
      target: { value },
    } = e;
    setSignatureBook(value);
  };

  const handleSubmitSignatureBook = async () => {
    //handleSubmitSignatureBook
    const { id } = queryString();
    if (!id) {
      return;
    }
    const payload = { id, message: signatureBook };
    const response = await userInstance().post('/signatureBook', payload);
    const {
      data: { code, msg },
    } = response;
    if (code === 200) {
      Notification('success', msg);
    } else {
      Notification('danger', msg);
    }
  };

  const openCloseComment = (index) => {
    let oldState = [...posts];
    const { selected } = oldState[index];
    oldState[index].selected = !selected;
    setPosts(oldState);
  };

  const addComment = async (e, postid) => {
    try {
      e.preventDefault();
      let webtoken = localStorage.getItem('webtoken').toString();
      if (commenttext && commenttext.trim()) {
        socket.emit('SendComment', { message: commenttext, postid, webtoken });
        setComment('');
      }
    } catch (error) {
      return error;
    }
  };

  const addPostReact = async (type, postid) => {
    try {
      const playload = { type, postid };
      const result = await userInstance().put('/addpostReact/', { playload });
      let { code } = result.data;
      if (code === 200) {
        getUserData();
        console.log('post reacted');
      }
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    handleSelectType('1vs1');
  }, [StatsOne]);

  useEffect(() => {
    const { friends: profileFriends } = profileData ? profileData : {};
    const { friends: openbyFriends } = userDetails ? userDetails : {};

    const { commanArray, firstFriend } = FriendsData(
      openbyFriends,
      profileFriends
    );
    setCommanFriends({
      ...firiendsData,
      friends: firstFriend,
      friendsCopy: firstFriend,
      commanFriends: commanArray,
      commanFriendsCopy: commanArray,
    });
  }, [profileData, userDetails]);

  const handleSelectType = (type) => {
    if (type === '1vs1') {
      const OnevsOne = GetNormalStatsData1vs1(StatsOne);

      const resuls = StatsOne.filter((el) => el.result).map(
        (el) => el.result.result
      );

      const payload = {
        gamesplayed: StatsOne.length,
        winrate: OnevsOne[8].winpercent,
        longestwinstreak: OnevsOne[10].streaks,
        recentresults: resuls,
        kd: OnevsOne[5].KDR,
        headshotsper: OnevsOne[6].headshot_per,
      };

      setSelectedModeData(payload);
    } else if (type === '5vs5') {
      const FivevsFive = GetNormalStatsData5vs5(StatsFive);

      const resuls = StatsFive.filter((el) => el.result).map(
        (el) => el.result.result
      );

      const payload = {
        gamesplayed: StatsFive.length,
        winrate: FivevsFive[8].winpercent,
        longestwinstreak: FivevsFive[10].streaks,
        recentresults: resuls,
        kd: FivevsFive[5].KDR,
        headshotsper: FivevsFive[6].headshot_per,
      };

      setSelectedModeData(payload);
    }
    setSelectedType(type);
  };

  const SearcFriends = (type, value) => {
    const { friendsCopy, commanFriendsCopy } = firiendsData;
    if (type === 'friends') {
      const exp = new RegExp(value.toLowerCase());
      const filteredData = friendsCopy.filter((item) =>
        exp.test(item.username.toLowerCase())
      );
      setCommanFriends({
        ...firiendsData,
        friends: filteredData,
      });
    } else if (type === 'comman') {
      const exp = new RegExp(value.toLowerCase());
      const filteredData = commanFriendsCopy.filter((item) =>
        exp.test(item.username.toLowerCase())
      );
      setCommanFriends({
        ...firiendsData,
        commanFriends: filteredData,
      });
    }
  };

  const functionProps = {
    openCloseComment,
    addPostReact,
    addComment,
    commenttext,
    setComment,
  };

  //Load user data
  useEffect(() => {
    getUserData();
  }, []);

  const userData = {
    profileData,
    acceptRequest,
    followUser,
    sendRequests,
    rejectRequest,
    tournaments,
    lastResults,
    signatureBook,
    handleSubmitSignatureBook,
    handleSignatureBook,
    StatsOne,
    StatsFive,
    handleSelectType,
    selectedModeData,
    selectedType,
    mostPlayedMaps,
    firiendsData,
    SearcFriends,
  };

  return (
    <>
      <Helmet>
        <body className="profile-main-page" />
      </Helmet>
      <Layout header={true} footer={true}>
        <UserProvider value={userData}>
          <div className="main-wrapper">
            <div className="middle-wrapper">
              <div className="main-profile-page">
                <div className="profile-page">
                  <ProfileTop />
                </div>
                <div className="profile-tabs">
                  <Tabs defaultActiveKey="0">
                    <Tab eventKey="0" title="GENERAL DESCRIPTION">
                      <ProfileInfo />
                      <Tournaments />
                      <LastMatches />
                      <Signature />
                    </Tab>
                    <Tab eventKey="1" title="PUBLICATIONS">
                      {posts && posts.length > 0 ? (
                        posts.map((el, i) => {
                          return (
                            <SocailPost
                              element={el}
                              index={i}
                              functions={functionProps}
                            />
                          );
                        })
                      ) : (
                        <div>
                          <h6>No data found</h6>
                        </div>
                      )}
                    </Tab>
                    <Tab eventKey="2" title="STREAMING">
                      <Streaming />
                    </Tab>
                    <Tab eventKey="3" title="STATISTICS">
                      <AdvanceStatistics />
                    </Tab>
                    <Tab eventKey="4" title="FRIENDS">
                      <Friends />
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </UserProvider>
      </Layout>
    </>
  );
};
export default Profile;
