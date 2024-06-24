import React, { useState, useEffect,useContext } from "react";
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
import CreateTournament from "./createtournament";
import Loader from '../loader/loader';
import advanced from "../../assets/tournament/advanced.png";
import premium from "../../assets/tournament/premium.png";
import { validateTournamentCreation, Notification } from "../../function";
import { tournamentInstance } from "../../config/axios";
import { GetTournaments,GetCreateTournament } from "../../socket";
import UserContext from '../../context/context';
const InitialImages = { 'Normal': normal, "Premium": premium, "Premium/advanced": advanced };
const InitialColor = { 'Normal': "white", "Premium": "#ffd366", "Premium/advanced": "#3f9758" };


const Tournament = () => {

    const initialState = { title: "", tournamentStart: new Date(), playerNumbers: 0, gameType: "", tournamentPrize: "", tournamentType: "Normal", banner: "" };
    const { userDetails} = useContext(UserContext);
    const { isturnament} = userDetails;
    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState(initialState);
    const [bannerimg, setBannerImg] = useState(null);
    const [loader, setIsLoader] = useState(false);
    const [tournaments, setTournaments] = useState([]);
    const [tournamentsCopy, setTournamentsCopy] = useState([]);
    const [searchData, setSearch] = useState('');
  

    useEffect(() => {
        ListTournamnets();

        GetTournaments(data => {
            setTournaments(preState => [...preState, data])
        })
        GetCreateTournament(data =>{
            setTournaments(preState => [...preState, data])
        })
    }, [])

    const handleClose = () => {
        setShow(!show);
    }

    const OnChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    }

    const selectTournamentGameType = (name, value) => {
        setValues({ ...values, [name]: value });
    }

    const SelectDate = (tournamentStart) => {
        setValues({ ...values, tournamentStart });
    }
    const handleImageChange = (event) => {
        try {
            setValues({ ...values, banner: URL.createObjectURL(event.target.files[0]) });
            setBannerImg(event.target.files[0])
        } catch (error) {
            return error;
        }
    }

    const HnadleCreateTournament = async (e) => {
        try {
            e.preventDefault();
            const { isValid, errors } = validateTournamentCreation(values, bannerimg);
            if (!isValid) {
                setErrors(errors);
                return;
            }
            const data = new FormData();
            data.append("file", bannerimg);
            setIsLoader(true);
            delete values.banner;
            const response = await tournamentInstance().post("/createTournament", data, {
                params: values
            });
            const { code, msg } = response.data;
            if (code === 200) {
                Notification("success", msg);
                setErrors({})
                setBannerImg(null);
                handleClose();
                setIsLoader(false);
                setValues(initialState);
            } else {
                Notification("danger", msg);
                setIsLoader(false)
            }
        } catch (error) {
            return error;
        }
    }

    const ListTournamnets = async () => {
        try {
            const response = await tournamentInstance().get("/tournaments");
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

    const RegisterInTournament = (_id) => {
        localStorage.setItem('t_tab_key', 'registration');
        history.push(`/inside-tournaments/?tid=${_id}`);
    }
    return (
        <Layout header={true} footer={true}>
            {loader && <Loader />}
            <div className="tournament">
                <div className="main-wrapper">
                    <LeftSidebar mainmenu={true} increase={true} community={true} voiceserver={true} />
                    <div className="middle-wrapper">
                        <TournamentHeader handleClose={handleClose} SearchTournaments={SearchTournaments} searchData={searchData} running={true} isturnament={isturnament} />
                        <div className="tournament-content custom-scroll">
                            {tournaments && tournaments.length > 0 ? tournaments.map((el, i) => {
                                return <TournamentItems elements={el} index={i} RegisterInTournament={RegisterInTournament} />
                            }) : <div className="not-found-data"><h3>Data not found!!</h3></div>}
                        </div>
                        <div className="finished-tournaments">
                            <Button onClick={() => history.push(`/finished-tournaments`)}>See Finished Tournaments</Button>
                        </div>
                    </div>
                    <RightSidebar />
                    {show && <CreateTournament show={show} handleClose={handleClose} errors={errors} OnChange={OnChange} values={values} selectTournamentGameType={selectTournamentGameType} SelectDate={SelectDate} handleImageChange={handleImageChange} HnadleCreateTournament={HnadleCreateTournament} />}
                </div>
            </div>
        </Layout>
    );
};
export default Tournament;
const TournamentItems = ({ elements, index, RegisterInTournament }) => {
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
                        <li><img src={prize} alt="prize" /> <span>{tournamentType.toLowerCase() !== 'normal' ? <i class="fa fa-eur" aria-hidden="true"></i> : <img src={coin} alt="coin" />}  {tournamentPrize}</span></li>
                    </ul>
                    <Button onClick={() => RegisterInTournament(_id)}>REGISTER</Button>
                </div>
            </div>
        </div>
    );
};