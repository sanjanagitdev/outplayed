import React, { useState, useEffect } from "react";
import "./tournament.css";
// import { Link } from "react-router-dom";
import Layout from "../layout/layout"
import LeftSidebar from "../sidebar/leftsidebar";
import RightSidebar from "../sidebar/rightsidebar";
import TournamentHeader from "./tournamentheader";
import { Button } from "react-bootstrap";
import history from "../../config/history";
import csgo from "../../assets/tournament/csgo.png";
import cover from "../../assets/tournament/csgo-cover.png";
import normal from "../../assets/tournament/logo-icon.png";
import time from "../../assets/tournament/time.png";
import player from "../../assets/tournament/player.png";
import prize from "../../assets/tournament/prize.png";
import coin from "../../assets/tournament/money-icon.png";
import advanced from "../../assets/tournament/advanced.png";
import premium from "../../assets/tournament/premium.png";
import { tournamentInstance } from "../../config/axios";
const InitialImages = { 'Normal': normal, "Premium": premium, "Premium/advanced": advanced };
const InitialColor = { 'Normal': "white", "Premium": "#ffd366", "Premium/advanced": "#3f9758" };


const FinishedTournaments = () => {
    const [tournaments, setTournaments] = useState([]);
    const [tournamentsCopy, setTournamentsCopy] = useState([]);
    const [searchData, setSearch] = useState('');

    useEffect(() => {
        ListFinishedTournamnets();
    }, [])



    const ListFinishedTournamnets = async () => {
        try {
            const response = await tournamentInstance().get("/finished-tournaments");
            const { data: { code, tournaments } } = response;
            if (code === 200) {
                setTournaments(tournaments);
                setTournamentsCopy(tournaments);
            }
        } catch (error) {
            return error;
        }
    }

    const SearchTournaments = value => {
        try {
            const exp = new RegExp(value.toLowerCase());
            const filteredData = tournamentsCopy.filter(item =>
                exp.test(item.title.toLowerCase()) || exp.test(item.gameType.toLowerCase()) || exp.test(item.tournamentType.toLowerCase())
            );
            setTournaments(filteredData);
            setSearch(value);
        } catch (e) {
            return e;
        }
    };


    return (
        <Layout header={true} footer={true}>
            <div className="tournament">
                <div className="main-wrapper">
                    <LeftSidebar mainmenu={true} increase={true} community={true} voiceserver={true} />
                    <div className="middle-wrapper">
                        <TournamentHeader handleClose={() => { }} SearchTournaments={SearchTournaments} searchData={searchData} running={false} />
                        <div className="tournament-content custom-scroll">
                            {tournaments && tournaments.length > 0 ? tournaments.map((el, i) => {
                                return <TournamentItems elements={el} index={i} />
                            }) : <div className="not-found-data"><h3>Data not found!!</h3></div>}
                        </div>
                    </div>
                    <RightSidebar />

                </div>
            </div>
        </Layout>
    );
};
export default FinishedTournaments;
const TournamentItems = ({ elements, index }) => {
    const { title, playerNumbers, gameType, tournamentType, tournamentStart, banner, tournamentPrize, _id } = elements;
    const startDataIs = new Date(tournamentStart).toLocaleString().split(",");
    return (
        <div className="tournament-box" key={index}>
            <div className="tournament-block" onClick={() => history.push(`/inside-tournaments/?tid=${_id}`)}>
                <div className="tournament-info">
                    <img src={csgo} alt="logo" className="gameicon" />
                    <div className="tournament-cover">
                        <img src={banner ? banner : cover} alt="cover" />
                    </div>
                    <div className="game-versus">
                        <span>{gameType}</span>
                    </div>
                </div>
                <div className="tournament-name">
                    <h2>{title}</h2>
                </div>
                <div className="tournament-type normal-game">
                    <h3 style={{ color: InitialColor[tournamentType] }}><img src={InitialImages[tournamentType]} alt="Images" /> {tournamentType} Tournament</h3>
                </div>
            </div>
            <div className="tournament-detail">
                <div className="tournament-list">
                    <ul>
                        <li><img src={time} alt="time" /> <span>{startDataIs[0]}<p>{startDataIs[1]}</p></span></li>
                        <li><img src={player} alt="player" /> <span>0/{playerNumbers}</span></li>
                        <li><img src={prize} alt="prize" /> <span><img src={coin} alt="coin" /> {tournamentPrize}</span></li>
                    </ul>
                    <Button className="btn btn-danger">FINISHED</Button>
                </div>
            </div>
        </div>
    );
};