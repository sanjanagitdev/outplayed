import React, { useState } from "react";
import {useTranslation} from 'react-i18next';
import { Link, NavLink } from "react-router-dom";
import { Form, Button, Nav} from 'react-bootstrap';

import twitter from "../../assets/social/twitter.png";
import instagram from "../../assets/social/instagram.png";
import youtube from "../../assets/social/youtube.png";
import twitch from "../../assets/social/twitch.png";



const OutplayedCommunity = () => {
   const{t} = useTranslation();
    return (
        <div className="outplayed-community">
                
            <h3>{t('header.outplayed-community')}</h3>

            <ul>
                <li>
                    <Link to="/"><img src={twitter} alt="twitter"/></Link>
                </li>
                <li>
                    <Link to="/"><img src={instagram} alt="Instagram"/></Link>
                </li>
                <li>
                    <Link to="/"><img src={youtube} alt="Youtube"/></Link>
                </li>
                <li>
                    <Link to="/"><img src={twitch} alt="Twitch"/></Link>
                </li>
            </ul>
        </div>
    );
};
export default OutplayedCommunity;
