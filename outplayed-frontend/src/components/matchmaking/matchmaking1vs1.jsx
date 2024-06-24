import React, { useState, useEffect, useContext } from "react";
import "./matchmaking.css";
// import { Link, NavLink } from "react-router-dom";
import Layout from "../layout/layout"
import LeftSidebar from "../sidebar/leftsidebar";
import RightSidebar from "../sidebar/rightsidebar";
import MatchMakingProfile from "./matchmakingprofile";
// import MonthlyRanking from "./monthlyranking";
import MonthlyRanking from "../hubs/monthlyrank";
import FeaturedStreaming from "./featuredstreaming";
// import GameSelection from "./gameselection";
import LookingGame1vs1 from "./lookinggame1vs1";
import UserContext from "../../context/context";
// import LookingGame5vs5 from "./lookinggame5vs5";
import {
    Notification,
    DecodeData,
    EncodeData,
    queryString,
    // MovePosition
} from "../../function";
import { matchmakingInstance } from "../../config/axios";
let interval = null;

const MatchMaking1vs1 = () => {
    const {
        userDetails: {
            ispremium,
            ispremiumadvnaced,
            username,
            useravatar,
        },
        loggedIn,
        distributedStats: { Stats1vs1, QueueLength1vs1 },
        distributedStats,
        setDistributedStats
    } = useContext(UserContext);
    const [UpDown, setUpDown] = useState({ rank: false, username: false, monthlyhubpoint: false, win: false, loss: false, winpercent: false });
    let checkTimer = localStorage.getItem('r_encoded_q^11') ? localStorage.getItem("~interval$%!11") : 0;
    const [timerView, setTimerView] = useState({ timer: checkTimer ? parseInt(checkTimer) : 0, isValid: false });
    useEffect(() => {
        try {
            checkQueue();
        } catch (error) {
            return error;
        }
    }, []);
    const StartQueue = async () => {
        //This function used to start the 1vs1 matchmaking queue.
        try {
            const { premium, advanced } = queryString();
            const response = await matchmakingInstance().post(
                "/queuefilter1v1", {
                premium,
                advanced
            });
            const {
                data: { code, msg, queueid, errors },
            } = response;
            if (code === 200) {
                const myCipher = EncodeData("24t5/T%$Q#7jJDvm24t5/T%$Q#7jJDvm");
                const EncodedQueue = myCipher(queueid);
                Notification("success", msg);
                localStorage.setItem("r_encoded_q^11", EncodedQueue);
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
            const queueid = localStorage.getItem("r_encoded_q^11");
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
                    localStorage.removeItem("r_encoded_q^11");
                    localStorage.removeItem("~interval$%!11");
                }
            }
        } catch (error) {
            return error;
        }
    };
    const StartTimer = () => {
        interval = setInterval(() => {
            if (localStorage.getItem('r_encoded_q^11')) {
                setTimerView((preState) => {
                    let { timer } = preState;
                    timer += 1;
                    localStorage.setItem("~interval$%!11", timer);
                    return { isValid: true, timer };
                });
            } else {
                ClearIntervalData();
            }

        }, 1000);
    };

    const removeQueue = async () => {
        try {
            const queueid = localStorage.getItem("r_encoded_q^11");
            if (queueid) {
                const myDecipher = DecodeData("24t5/T%$Q#7jJDvm24t5/T%$Q#7jJDvm");
                const decoded = myDecipher(queueid);
                const response = await matchmakingInstance().delete(
                    `/removequeue1vs1/${decoded}`
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
        localStorage.removeItem("r_encoded_q^11");
        localStorage.removeItem("~interval$%!11");
    }

    const SortData = (type) => {
        let OldState = [...Stats1vs1];
        OldState = OldState.sort((a, b) => {
            if (typeof a[type] === 'string' && typeof b[type] === 'string') {
                return UpDown[type] ? a[type].localeCompare(b[type]) : b[type].localeCompare(a[type])
            } else {
                return UpDown[type] ? b[type] - a[type] : a[type] - b[type]
            }
        });
        setDistributedStats({ ...distributedStats, Stats1vs1: OldState });
        setUpDown({ ...UpDown, [type]: !UpDown[type] });
    }
    return (
        <Layout header={true} footer={true}>
            <div className="hubs-page">

                <div className="main-wrapper">

                    <LeftSidebar mainmenu={true} increase={true} community={true} voiceserver={true} />

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
                            <LookingGame1vs1 StartQueue={StartQueue} username={username}
                                useravatar={useravatar} timerView={timerView}
                                removeQueue={removeQueue} QueueLength1vs1={QueueLength1vs1} />
                            <MonthlyRanking MonthlyRank={Stats1vs1 ? Stats1vs1 : []} SortData={SortData} UpDown={UpDown} />
                            <FeaturedStreaming />
                        </div>
                    </div>
                    <RightSidebar />
                </div>
            </div>
        </Layout>
    );
};

export default MatchMaking1vs1;