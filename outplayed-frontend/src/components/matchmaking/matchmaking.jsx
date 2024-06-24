import React, { useState, useContext, useEffect } from "react";
import "./matchmaking.css";
import Layout from "../layout/layout";
import LeftSidebar from "../sidebar/leftsidebar";
import RightSidebar from "../sidebar/rightsidebar";
import MatchMakingProfile from "./matchmakingprofile";
import MonthlyRanking from "../hubs/monthlyrank";
import FeaturedStreaming from "./featuredstreaming";
import GameSelection from "./gameselection";
import UserContext from '../../context/context';
import MatchMakingTeam from "../popups/matchmakingteam";
import { Notification, EncodeData, checkPlayersStatus } from "../../function";
import history from "../../config/history";

const MatchMaking = () => {
    const { userDetails: { group, teams, ispremium, ispremiumadvnaced, username, useravatar }, loggedIn, distributedStats, distributedStats: { Stats5vs5, QueueLength5vs5 }, setDistributedStats } = useContext(UserContext);
    const [premium, setPremium] = useState(false);
    const [advanced1vs1, setAdvanced1vs1] = useState(false);
    const [premium1vs1, setPremium1vs1] = useState(false);
    const [advanced, setAdvanced] = useState(false);
    const [errors, setErrors] = useState({});
    const [showteam, setShowTeam] = useState(false);
    // const [MonthlyRank, SetMonthlyRanking] = useState([]);
    // const [MonthlyRankCopy, SetMonthlyRankingCopy] = useState([]);
    const [UpDown, setUpDown] = useState({ rank: false, username: false, monthlyhubpoint: false, win: false, loss: false, winpercent: false });

    const handleClose = () => {
        if (loggedIn) {
            if (group) {
                const { _id } = group;
                RedirectPlayer('group', _id);
            } else {
                Notification('danger', 'Please try to join or create a group and then start matchmaking');
            }
        } else {
            Notification('danger', 'Please try to login and the select a game !!')
        }
    };
    const handleCloseTeam = () => {
        if (loggedIn) {
            setShowTeam(!showteam)
        } else {
            Notification('danger', 'Please try to login and the select a game !!')
        }
    };

    const RedirectPlayer = (type, id) => {
        const encoded = EncodeData('24t5/T%$Q#7jJDvm24t5/T%$Q#7jJDvm');
        type = encoded(type);
        id = encoded(id);
        history.push(`/matchmaking5vs5?type=${type}&id=${id}&premium=${premium}&advanced=${advanced}`);
    }
    const RedirectPlayerSolo = (type) => {
        if (!group) {
            const encoded = EncodeData('24t5/T%$Q#7jJDvm24t5/T%$Q#7jJDvm');
            type = encoded(type);
            history.push(`/matchmaking5vs5?type=${type}&premium=${premium}&advanced=${advanced}`);
        } else {
            Notification('danger', 'If you are in a group, you cannot search for a game alone, you have to leave the group.')
        }
    }
    const RedirectWithTeam = (type, id) => {
        const filterTeam = teams.filter(el => el._id === id);
        if (filterTeam.length > 0) {
            const { joinedmembers } = filterTeam[0];
            const { isValid, errors } = checkPlayersStatus(joinedmembers);
            if (!isValid) {
                setErrors(errors)
                return;
            }
            const encoded = EncodeData('24t5/T%$Q#7jJDvm24t5/T%$Q#7jJDvm');
            type = encoded(type);
            id = encoded(id);
            history.push(`/matchmaking5vs5?type=${type}&id=${id}&premium=${premium}&advanced=${advanced}`);
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

    const Play1vs1 = () => {
        history.push(`/matchmaking1vs1?premium=${premium1vs1}&advanced=${advanced1vs1}`);
    }

    return (
        <Layout header={true} footer={true}>
            <div className="hubs-page">

                <div className="main-wrapper">

                    <LeftSidebar mainmenu={true} increase={true} community={true} voiceserver={true} />

                    <div className="middle-wrapper">

                        <div className="matchmaking">
                            {loggedIn && <MatchMakingProfile username={username} useravatar={useravatar} ispremium={ispremium} ispremiumadvnaced={ispremiumadvnaced} />}
                            <GameSelection handleClose={handleClose} premium={premium} advanced={advanced} setPremium={setPremium} setAdvanced={setAdvanced} RedirectPlayerSolo={RedirectPlayerSolo} handleCloseTeam={handleCloseTeam} queueLength={QueueLength5vs5} RedirectPlayer={RedirectPlayer} Play1vs1={Play1vs1} premium1vs1={premium1vs1} advanced1vs1={advanced1vs1} setPremium1vs1={setPremium1vs1} setAdvanced1vs1={setAdvanced1vs1} />
                            <MonthlyRanking MonthlyRank={Stats5vs5 ? Stats5vs5 : []} SortData={SortData} UpDown={UpDown} />
                            <FeaturedStreaming />
                        </div>
                    </div>
                    <RightSidebar />
                </div>
            </div>
            {showteam && <MatchMakingTeam show={showteam} handleClose={handleCloseTeam} teams={teams} handleShow={() => { }} RedirectWithTeam={RedirectWithTeam} errors={errors} />}
        </Layout>
    );
};

export default MatchMaking;