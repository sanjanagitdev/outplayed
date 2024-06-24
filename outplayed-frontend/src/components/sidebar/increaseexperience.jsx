import React from "react";
import {useTranslation} from 'react-i18next'
import { Link } from "react-router-dom";
import advanced from "../../assets/menu/advanced.png";
import premium from "../../assets/menu/premium.png";


const IncreaseExperience = () => {
const {t} = useTranslation();
    return (
        <div className="increase-experience">

            <h3>{t('header.increase-exp')}:</h3>

            <Link className="advanced-btn" to="/advance"><img src={advanced} alt="" /> {t('header.advance')}</Link>
            <Link className="premium-btn" to="/premium"><img src={premium} alt="" /> {t('header.premium')}</Link>
        </div>
    );
};
export default IncreaseExperience;
