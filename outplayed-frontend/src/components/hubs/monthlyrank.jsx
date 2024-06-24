import React from "react";
import "../matchmaking/matchmaking.css";
import {useTranslation} from 'react-i18next';
// import { Link } from "react-router-dom";
// import { Button } from 'react-bootstrap';
// import Dropdown from 'react-bootstrap/Dropdown'
import user from "../../assets/matchmaking/user.png";
// import firstwinner from "../../assets/matchmaking/firstwinner.png";
// import secondwinner from "../../assets/matchmaking/secondwinner.png";
// import thirdwinner from "../../assets/matchmaking/thirdwinner.png";
// import prestige from "../../assets/hubs/prestige1.png";
import { GetPrestigeAccPoint } from "../../function";
const MonthlyRanking = ({ MonthlyRank, SortData, UpDown }) => {
    const {t} = useTranslation();
    const { rank, username, monthlyhubpoint, win, loss, winpercent } = UpDown;
    return (
        <div className="monthly-ranking">
            <div className="monthly-list">
                <h2>{t('global.monthlyranking')}</h2>
                <div className="monthly-table">
                    <div className="monthly-header">
                        <div className="monthly-type">
                        {t('global.rank')} <i class={`fa fa-angle-${rank ? 'up' : 'down'}`} aria-hidden="true"></i>
                        </div>
                        <div className="monthly-name">
                        {t('global.player')} <i class={`fa fa-angle-${username ? 'up' : 'down'}`} onClick={() => SortData('username')} aria-hidden="true"></i>

                        </div>
                        <div className="monthly-prestige">
                        {t('global.score')} <i class={`fa fa-angle-${monthlyhubpoint ? 'up' : 'down'}`} onClick={() => SortData('monthlyhubpoint')} aria-hidden="true"></i>

                        </div>
                        <div className="monthly-map">
                        {t('global.win')} <i class={`fa fa-angle-${win ? 'up' : 'down'}`} onClick={() => SortData('win')} aria-hidden="true"></i>

                        </div>
                        <div className="monthly-join">
                        {t('global.losses')} <i class={`fa fa-angle-${loss ? 'up' : 'down'}`} onClick={() => SortData('loss')} aria-hidden="true"></i>

                        </div>

                        <div className="monthly-wins">
                            %{t('global.win')} <i class={`fa fa-angle-${winpercent ? 'up' : 'down'}`} onClick={() => SortData('winpercent')} aria-hidden="true"></i>
                        </div>
                    </div>
                    <div className="monthly-body">
                        {/* <div className="monthly-list-view first-winner">
                            <div className="monthly-type">
                                <span><img src={firstwinner} alt="premium" /> 1</span>
                            </div>
                            <div className="monthly-name">
                                <span><img src={user} alt="premium" /> Filipone <img src={prestige} alt="prestige" /></span>
                            </div>
                            <div className="monthly-prestige">
                                <span>288</span>
                            </div>
                            <div className="monthly-map">
                                <span>22</span>
                            </div>
                            <div className="monthly-join">
                                <span>0</span>
                            </div>
                            <div className="monthly-wins">
                                <span>100%</span>
                            </div>
                        </div> */}
                        {/* <div className="monthly-list-view second-winner">
                            <div className="monthly-type">
                                <span><img src={secondwinner} alt="premium" /> 2</span>
                            </div>
                            <div className="monthly-name">
                                <span><img src={user} alt="premium" /> Filipone <img src={prestige} alt="prestige" /></span>
                            </div>
                            <div className="monthly-prestige">
                                <span>288</span>
                            </div>
                            <div className="monthly-map">
                                <span>22</span>
                            </div>
                            <div className="monthly-join">
                                <span>0</span>
                            </div>
                            <div className="monthly-wins">
                                <span>100%</span>
                            </div>
                        </div> */}
                        {/* <div className="monthly-list-view third-winner">
                            <div className="monthly-type">
                                <span><img src={thirdwinner} alt="premium" /> 3</span>
                            </div>
                            <div className="monthly-name">
                                <span><img src={user} alt="premium" /> Filipone <img src={prestige} alt="prestige" /></span>
                            </div>
                            <div className="monthly-prestige">
                                <span>288</span>
                            </div>
                            <div className="monthly-map">
                                <span>22</span>
                            </div>
                            <div className="monthly-join">
                                <span>0</span>
                            </div>
                            <div className="monthly-wins">
                                <span>100%</span>
                            </div>
                        </div> */}
                        {MonthlyRank.length > 0 ? <React.Fragment>
                            {MonthlyRank.map((el, i) => {
                                return <ListItem element={el} index={i} />
                            })}
                        </React.Fragment> : <React.Fragment>
                                <h5>{t('global.no-data')}</h5>
                            </React.Fragment>}
                        {/* <div className="monthly-list-view last-row">
                            <div className="monthly-type">
                                <span>38</span>
                            </div>
                            <div className="monthly-name">
                                <span><img src={user} alt="premium" /> Prueba <img src={prestige} alt="prestige" /></span>
                            </div>
                            <div className="monthly-prestige">
                                <span>85</span>
                            </div>
                            <div className="monthly-map">
                                <span>7</span>
                            </div>
                            <div className="monthly-join">
                                <span>1</span>
                            </div>
                            <div className="monthly-wins">
                                <span>93,33%</span>
                            </div>
                        </div> */}
                    </div>
                    <div className="monthly-footer">
                        {/* <Button className="monthlys-btn">See more</Button> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyRanking;



const ListItem = ({ element, index }) => {
    const { username, prestige, lost, win, useravatar, monthlyhubpoint, winpercent } = element;
    return <div className="monthly-list-view" key={index}>
        <div className="monthly-type">
            <span>{index + 1}</span>
        </div>
        <div className="monthly-name">
            <span><img src={useravatar ? useravatar : user} alt="premium" /> {username} <img src={GetPrestigeAccPoint(prestige)} alt="prestige" /></span>
        </div>
        <div className="monthly-prestige">
            <span>{monthlyhubpoint}</span>
        </div>
        <div className="monthly-map">
            <span>{win}</span>
        </div>
        <div className="monthly-join">
            <span>{lost}</span>
        </div>
        <div className="monthly-wins">
            <span>{winpercent.toFixed(2)}%</span>
        </div>
    </div>
}