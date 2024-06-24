import React, { useState, useEffect, useContext } from "react";
import "./matchmaking.css";
import Layout from "../layout/layout";
import LeftSidebar from "../sidebar/leftsidebar";
import RightSidebar from "../sidebar/rightsidebar";
import MatchMakingProfile from "./matchmakingprofile";
import MonthlyRanking from "../hubs/monthlyrank";
import FeaturedStreaming from "./featuredstreaming";
import MatchMakingGroup from "../popups/matchmakinggroup";
import LookingGame5vs5 from "./lookinggame5vs5";
import UserContext from "../../context/context";
import {
  Notification,
  DecodeData,
  EncodeData,
  queryString,
  MovePosition
} from "../../function";
import { matchmakingInstance, userInstance } from "../../config/axios";
let interval = null;

const MatchMaking5vs5 = () => {
  const {
    userDetails: {
      group,
      // teams,
      ispremium,
      ispremiumadvnaced,
      username,
      useravatar,
      onlinefriends,
      groupJoinedLength,
      userid
    },
    loggedIn,
    distributedStats: { Stats5vs5, QueueLength5vs5 },
    distributedStats,
    setDistributedStats
  } = useContext(UserContext);
  const { members: myGroupMembers, joinedmembers } = group ? group : { members: [] };
  let checkTimer = localStorage.getItem('r_encoded_q^') ? localStorage.getItem("~interval$%!") : 0;
  const [timerView, setTimerView] = useState({ timer: checkTimer ? parseInt(checkTimer) : 0, isValid: false });
  const [typeValue, setTypeValue] = useState({
    type: "",
    id: "",
    premium: false,
    advanced: false,
  });
  const [members, setMembers] = useState([]);
  const [solo, setSolo] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [errors, setErrors] = useState({});
  const [indexValue, setIndexValue] = useState(0);
  const [UpDown, setUpDown] = useState({ rank: false, username: false, monthlyhubpoint: false, win: false, loss: false, winpercent: false });
  useEffect(() => {
    try {
      const { type, id, premium, advanced } = queryString();
      const myDecipher = DecodeData("24t5/T%$Q#7jJDvm24t5/T%$Q#7jJDvm");
      const decodedType = type ? myDecipher(type) : "";
      const decodedId = id ? myDecipher(id) : "";
      if (decodedType || decodedId) {
        setTypeValue({
          type: decodedType,
          id: decodedId,
          premium: premium === "true" ? true : false,
          advanced: advanced === "true" ? true : false,
        });
        if (decodedType !== 'solo') {
          GetPlayerData(decodedId, decodedType);
        } else if (decodedType === "solo") {
          setSolo(true);
        }
        checkQueue();
      }

    } catch (error) {
      return error;
    }
  }, []);

  const StartQueue = async () => {
    //This function used to start the matchmaking queue.
    try {
      const response = await matchmakingInstance().post(
        "/queuefilter5v5",
        typeValue
      );
      const {
        data: { code, msg, queueid, errors },
      } = response;
      if (code === 200) {
        const myCipher = EncodeData("24t5/T%$Q#7jJDvm24t5/T%$Q#7jJDvm");
        const EncodedQueue = myCipher(queueid);
        Notification("success", msg);
        localStorage.setItem("r_encoded_q^", EncodedQueue);
        StartTimer();
      } else if (code === 201) {
        Notification("danger", Object.values(errors)[0]);
      } else {
        Notification("danger", msg);
      }
    } catch (error) {
      //Error
      return error;
    }
  };


  const checkQueue = async () => {
    try {
      const queueid = localStorage.getItem("r_encoded_q^");
      if (queueid) {
        const myDecipher = DecodeData("24t5/T%$Q#7jJDvm24t5/T%$Q#7jJDvm");
        const decoded = myDecipher(queueid);
        const response = await matchmakingInstance().get(
          `/checkvalidqueue/${decoded}`
        );
        const {
          data: { code },
        } = response;
        if (code === 200) {
          StartTimer();
        } else {
          localStorage.removeItem("r_encoded_q^");
          localStorage.removeItem("~interval$%!");
        }
      }
    } catch (error) {
      return error;
    }
  };
  const StartTimer = () => {
    interval = setInterval(() => {
      if (localStorage.getItem('r_encoded_q^')) {
        setTimerView((preState) => {
          let { timer } = preState;
          timer += 1;
          localStorage.setItem("~interval$%!", timer);
          return { isValid: true, timer };
        });
      } else {
        ClearIntervalData();
      }

    }, 1000);
  };

  const removeQueue = async () => {
    try {
      const queueid = localStorage.getItem("r_encoded_q^");
      if (queueid) {
        const { type } = typeValue;
        const myDecipher = DecodeData("24t5/T%$Q#7jJDvm24t5/T%$Q#7jJDvm");
        const decoded = myDecipher(queueid);
        const response = await matchmakingInstance().delete(
          `/removequeue/${decoded}/${type}`
        );
        const {
          data: { code, msg },
        } = response;
        if (code === 200) {
          Notification("success", msg);
          ClearIntervalData();

        } else {
          Notification("danger", msg);
        }
      }
    } catch (error) {
      return error;
    }
  };

  const ClearIntervalData = () => {
    clearInterval(interval);
    setTimerView({ isValid: false, timer: 0 });
    localStorage.removeItem("r_encoded_q^");
    localStorage.removeItem("~interval$%!");
  }

  const GetPlayerData = async (id, type) => {
    try {
      const response = await matchmakingInstance().get(`/playersinqueue/${type}/${id}`);
      const { data: { code, joinedmembers } } = response;
      if (code === 200) {
        if (joinedmembers.length >= 5) {
          const myIndex = joinedmembers.findIndex(el => el._id === localStorage.getItem('userid'));
          MovePosition(joinedmembers, myIndex, 2);
          setMembers(joinedmembers);
        } else {
          setMembers(joinedmembers);
        }
        if (type === 'group') {
          setIsGroup(true);
        }
      }
    } catch (e) {
      return e;
    }
  }

  const handleClose = (index, type) => {
    if (type === 'open') {
      setIndexValue(index);
    }
    setShow(!show)

  }

  const InviteInGroup = async (id) => {
    const payload = { index: indexValue };
    const response = await userInstance().patch(`/inviteingroup/${id}`, payload);
    const { data: { code, msg } } = response;
    if (code === 200) {
      Notification('success', msg)
    } else {
      Notification('danger', msg)
    }
  }

  const StartGroupMatchmkaing = () => {
    if (groupJoinedLength.length < 5) {
      const required = 5 - groupJoinedLength.length;
      Notification('danger', `Please add ${required} more members to satat queue`)
    } else {
      const playerLength = myGroupMembers.filter(el => el.joined);
      if (playerLength.length === 5) {
        StartQueue();
      } else {
        Notification('danger', `Some invited members are not joined the group, please be Patience !!`);
      }
    }
  }

  const SortData = (type) => {
    let OldState = [...Stats5vs5];
    OldState = OldState.sort((a, b) => {
      if (typeof a[type] === 'string' && typeof b[type] === 'string') {
        return UpDown[type] ? a[type].localeCompare(b[type]) : b[type].localeCompare(a[type])
      } else {
        return UpDown[type] ? b[type] - a[type] : a[type] - b[type]
      }
    });
    setDistributedStats({ ...distributedStats, Stats5vs5: OldState });
    setUpDown({ ...UpDown, [type]: !UpDown[type] });
  }



  return (
    <Layout header={true} footer={true}>
      <div className="hubs-page">
        <div className="main-wrapper">
          <LeftSidebar
            mainmenu={true}
            increase={true}
            community={true}
            voiceserver={true}
          />
          <div className="middle-wrapper">
            <div className="matchmaking">
              {loggedIn && (
                <MatchMakingProfile
                  username={username}
                  useravatar={useravatar}
                  ispremium={ispremium}
                  ispremiumadvnaced={ispremiumadvnaced}
                />
              )}
              <LookingGame5vs5
                timerView={timerView}
                typeValue={typeValue}
                StartQueue={StartQueue}
                removeQueue={removeQueue}
                members={members}
                solo={solo}
                username={username}
                useravatar={useravatar}
                myGroupMembers={myGroupMembers}
                isGroup={isGroup}
                groupJoinedLength={groupJoinedLength}
                handleClose={handleClose}
                StartGroupMatchmkaing={StartGroupMatchmkaing}
              />
              <MonthlyRanking MonthlyRank={Stats5vs5 ? Stats5vs5 : []} SortData={SortData} UpDown={UpDown} />
              <FeaturedStreaming />
            </div>
          </div>
          <RightSidebar />
        </div>
      </div>
      {show && <MatchMakingGroup show={show} handleClose={handleClose} onlinePlyaers={onlinefriends} joinedPlayers={joinedmembers} selectMember={() => { }} selectedPlayers={selectedPlayers} removeMember={() => { }} errors={errors} sendInvitation={() => { }} userid={userid} InviteInGroup={InviteInGroup} />}
    </Layout>
  );
};

export default MatchMaking5vs5;
