import React, { useState } from 'react'
import Layout from '../layout/layout'
import { Tab } from "react-bootstrap";
import Tabs from 'react-bootstrap/Tabs';
import LeftSidebar from '../sidebar/leftsidebar'
import RightSidebar from '../sidebar/rightsidebar'
import './ladder.css';
import csgoimg from '../../assets/tournament/csgo-cover.png'
import InfoTab from './info-tab';
import matchmaking from '../../assets/menu/matchmaking.png'
import PopupWrapper from '../popups/popupwrapper';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LadderBox from './ladder-box';
import Rules from './rules-tab';
import Classification from './classification';

const LadderPage = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [show, setShow] = useState(true);
    const handleClose = () => {
        setShow(!show);
    }


    const CustomInput = ({ value, onClick }) => (
        <div className="claendar-input" onClick={onClick}>
            <input type="text" placeholder="dd/mm/yyyy" value={value} />
            <i className="fa fa-calendar"></i>
        </div>
    );
    return (
        <Layout header={true} footer={true}>
            <div className="statistics-page">
                <div className="main-wrapper">
                    <LeftSidebar mainmenu={true} increase={true} community={true} voiceserver={true} />
                    <div className="middle-wrapper">
                        <div className="ladder-page-section">
                            <div className="ladder-header">
                                <h6>Ladder's Name</h6>
                            </div>
                            <div className="ladderimg ">
                                <LadderBox />
                            </div>
                            <div className="ladder-tab">
                                <Tabs defaultActiveKey="summary" id="uncontrolled-tab-example">
                                    <Tab eventKey="summary" title="Info">
                                        <InfoTab />
                                    </Tab>
                                    <Tab eventKey="rewards" title="Rules">
                                        <Rules />
                                    </Tab>
                                    <Tab eventKey="brackets" title="Clasification">
                                        <Classification />
                                    </Tab>
                                </Tabs>
                            </div>
                            <div className="ladder-bottom">
                                <div className="ladder-finish">
                                    <h6> Finished ladder's</h6>
                                </div>
                                <LadderBox />
                            </div>
                        </div>
                    </div>
                    <RightSidebar />
                </div>

                <PopupWrapper show={show} handleClose={handleClose} defaultClass={"ladder-popup"}>
                    <div className="ladderr-popup">
                        <h6>CHanllange  a player</h6>
                        <img src={matchmaking} alt="ladder" />
                        <div className="ladder-play">
                            <div className="player-one-ladder">
                                From@: Player1
                 </div>
                            <div className="player-two-ladder">
                                To@: Player2
                 </div>
                        </div>
                        <div className="choose-date">
                            <h5>Choose date</h5>
                            <div className="choose-date-time">
                                <DatePicker
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    maxDate={new Date()}
                                    customInput={<CustomInput />}
                                />
                                {/* <button type="submit"><i className="fa fa-calendar" /></button> */}
                            </div>
                        </div>
                        <div className="choose-date">
                            <h5>Choose date</h5>
                            <div className="choose-date-time">
                                <input type="time" placeholder="14/09/2002" />
                                <button type="submit"><i className="fa fa-chevron-down" aria-hidden="true"></i></button>
                            </div>
                        </div>
                        <div className="challange-button">
                            <button type="submit" >Challange</button>
                        </div>
                    </div>
                </PopupWrapper>

            </div>
        </Layout>

    )
}
export default LadderPage;


