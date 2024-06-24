import React, { useEffect, useState, useContext } from "react";
import "./team.css";
import Layout from "../layout/layout";
import LeftSidebar from "../sidebar/leftsidebar";
import RightSidebar from "../sidebar/rightsidebar";
//import { Button, Tabs, Tab, Form } from 'react-bootstrap';
import TeamList from './teamlist';
import GroupList from './grouplist';
import { userInstance } from "../../config/axios";
import { queryString, Notification } from '../../function';
import history from '../../config/history';
import UserContext from '../../context/context';
const Team = () => {
    const { userDetails, setUserDetails } = useContext(UserContext);
    const [teamData, setTeamData] = useState({});
    const [lodaer, setLoader] = useState(false);
    const [isLogged, SetIsLogged] = useState(false);
    const [CheckExist, SetExist] = useState(false);

    useEffect(() => {
        FetchData();
    }, []);

    const FetchData = async () => {
        try {
            const { id } = queryString();
            if (id) {
                const response = await userInstance().get(`/teamdata/${id}`);
                const { data: { code, teamdata, islogged } } = response;
                if (code === 200) {
                    const { joinedmembers } = teamdata;
                    const IsExist = joinedmembers.filter(el => el._id === islogged);
                    if (IsExist.length > 0) {
                        SetExist(true);
                    }
                    setTeamData(teamdata);
                    setLoader(true);
                    SetIsLogged(islogged);
                }
            }
        } catch (e) {
            return e;
        }
    }
    const removeMember = async (type, id) => {
        try {
            const { id: teamid } = queryString();
            const response = await userInstance().delete(`/removeuser/${id}/${type}/${teamid}`);
            const { data: { code, msg } } = response;
            if (code === 200) {
                const { joinedmembers } = { ...teamData };
                const removePlayer = joinedmembers.filter(el => el._id !== id);
                setTeamData({ ...teamData, joinedmembers: removePlayer });
                Notification('success', msg);
            } else {
                Notification('danger', msg);
            }
        } catch (e) {
            return e;
        }
    }
    const leaveTeam = async () => {
        try {
            const { id: teamid } = queryString();
            const response = await userInstance().put(`/leaveteam/${teamid}`);
            const { data: { code, msg } } = response;
            if (code === 200) {
                let { teams } = userDetails;
                teams = teams.filter(el => el._id !== teamid);
                setUserDetails({ ...userDetails, teams: teams });
                Notification('success', msg);
                history.push('/');
            } else {
                Notification('danger', msg);
            }
        } catch (e) {
            return e;
        }
    }
    const deleteTeam = async () => {
        try {
            const { id: teamid } = queryString();
            const response = await userInstance().delete(`/deleteteam/${teamid}`);
            const { data: { code, msg } } = response;
            if (code === 200) {
                let { teams } = userDetails;
                teams = teams.filter(el => el._id !== teamid);
                setUserDetails({ ...userDetails, teams: teams });
                Notification('success', msg);
                history.push('/');
            } else {
                Notification('danger', msg);
            }
        } catch (e) {
            return e;
        }
    }
    const { joinedmembers, creator } = teamData;
    return (
        <Layout header={true} footer={true}>
            <div className="team-page">
                <div className="main-wrapper">
                    <LeftSidebar mainmenu={true} increase={true} community={true} voiceserver={true} />
                    <div className="middle-wrapper">
                        {lodaer ? <div className="team">
                            <TeamList teamData={teamData} isLogged={isLogged} CheckExist={CheckExist} leaveTeam={leaveTeam} deleteTeam={deleteTeam} />
                            <GroupList joinedmembers={joinedmembers} removeMember={removeMember} isLogged={isLogged} CheckExist={CheckExist} creator={creator} />
                        </div> : null}
                    </div>
                    <RightSidebar />
                </div>
            </div>
        </Layout>
    );
};
export default Team;

