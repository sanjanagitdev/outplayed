import React, { useState } from "react";
import {useTranslation} from 'react-i18next';
import { Link, NavLink } from "react-router-dom";
import { Form, Button, Nav} from 'react-bootstrap';

import server1 from "../../assets/menu/servericon1.png";
import server2 from "../../assets/menu/servericon2.png";




const VoiceServer = () => {
   const {t} = useTranslation();
    return (
        <div className="voice-service">
                
            <h3>{t('header.voice-server')}</h3>

            <ul>
                <li>
                    <Link to="/"><img src={server1} alt="Server"/></Link>
                </li>
                <li>
                    <Link to="/"><img src={server2} alt="Server"/></Link>
                </li>
               
            </ul>
            
        </div>
    );
};
export default VoiceServer;
