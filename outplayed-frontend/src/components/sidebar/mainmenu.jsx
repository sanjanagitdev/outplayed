import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Form, Button, Nav} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import news from "../../assets/menu/news.png";
import hubs from "../../assets/menu/hubs.png";
import matchmaking from "../../assets/menu/matchmaking.png";
import tournaments from "../../assets/menu/tournament.png";
import ladders from "../../assets/menu/ladder.png";
import statistics from "../../assets/menu/statistic.png";
import scouting from "../../assets/menu/scouting.png";
import store from "../../assets/menu/store.png";


const MainMenu = () => {
   const {t} = useTranslation();
    return (
        <div className="main-menu">

            <Nav>
                <NavLink exact className="nav-link" to="/news"><img src={news} alt="News" /> <span>{t('leftsidebar.news')}</span></NavLink>
                <NavLink className="nav-link" to="/hubs"><img src={hubs} alt="Hubs" /> <span>{t('leftsidebar.hubs')}</span></NavLink>
                <NavLink className="nav-link" to="/matchmaking"><img src={matchmaking} alt="Matchmaking" /> <span>{t('leftsidebar.matchmaking')}</span></NavLink>
                <NavLink className="nav-link" to="/tournaments"><img src={tournaments} alt="Tournaments" /> <span>{t('leftsidebar.tournament')}</span></NavLink>
                <NavLink className="nav-link" to="/ladder"><img src={ladders} alt="Ladders" /> <span>{t('leftsidebar.ladders')}</span></NavLink>
                <NavLink className="nav-link" to="/statistics"><img src={statistics} alt="Statistics" /> <span>{t('leftsidebar.statistics')}</span></NavLink>
                <NavLink className="nav-link" to="/scoutingarea"><img src={scouting} alt="Scouting Area" /> <span>{t('leftsidebar.scoutingarea')}</span></NavLink>
                <NavLink className="nav-link" to="/store"><img src={store} alt="Store" /> <span>{t('leftsidebar.store')}</span></NavLink>
            </Nav>
            
        </div>
    );
};
export default MainMenu;
