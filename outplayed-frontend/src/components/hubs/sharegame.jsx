import React from "react";
import {useTranslation} from 'react-i18next';
import "./hubs.css";
import { Link } from "react-router-dom";
// import { Button, Form, FormControl, Tab, Table } from 'react-bootstrap';
import outplayed from "../../assets/social/outplayed.png";
import twitter from "../../assets/social/twitter.png";
import instagram from "../../assets/social/instagram.png";



const ShareGame = () => {
    const {t} = useTranslation();
    return (

        <div className="share-game">

            <div className="share-game-content">
                <h4>{t('hub.share-game')}</h4>
                <span>{t('hub.on-live')}</span>
            </div>

            <div className="share-game-icons">
                <ul>
                    <li><Link><img src={outplayed} alt="outplayed" /></Link></li>
                    <li><Link><img src={twitter} alt="twitter" /></Link></li>
                    <li><Link><img src={instagram} alt="instagram" /></Link></li>
                </ul>
            </div>

        </div>

    );
};

export default ShareGame;