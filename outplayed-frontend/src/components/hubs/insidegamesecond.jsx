import React from "react";
import "./hubs.css";
//import { Link, NavLink } from "react-router-dom";
import Layout from "../layout/layout"
import LeftSidebar from "../sidebar/leftsidebar";
//import prestige from "../../assets/hubs/prestige3.png";
import RightSidebar from "../sidebar/rightsidebar";
import Teams from "./teams";
// import user from "../../assets/hubs/user.png";
// import { Button, Form, FormControl, Tab, Table } from 'react-bootstrap';
// import InputGroup from 'react-bootstrap/InputGroup'
// import verified from "../../assets/hubs/verified.png";
// import premium from "../../assets/hubs/premium.png";
// import tick from "../../assets/hubs/tick.png";
// import Tabs from 'react-bootstrap/Tabs';
import PlayGame from "./playgame";

const InsideGameSecond = () => {
    return (
        <Layout header={true} footer={true}>
            <div className="game-finished-page">

                <div className="main-wrapper">

                    <LeftSidebar mainmenu={true} increase={true} community={true} voiceserver={true} />

                    <div className="middle-wrapper">

                        <div className="game-finished-top-section">

                            <Teams checkfull={'true'} team1={[12]} team2={[12]} name="Player1" />

                        </div>



                        <div className="game-finished-content">




                            <PlayGame />




                        </div>









                    </div>

                    <RightSidebar />


                </div>


            </div>
        </Layout>
    );
};

export default InsideGameSecond;


