import React, { useContext } from "react";
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import "./sidebar.css";
import Friends from "./friends";
import Team from "./team";
import Group from "./group";
import UserContext from '../../context/context';
const RightSidebar = () => {
    const { loggedIn } = useContext(UserContext);
    return (
        <div className="right-sidebar">
            {!loggedIn ? <React.Fragment><TwitterTimelineEmbed
                sourceType="profile"
                screenName="csgo"
                options={{ tweetLimit: '4', height: 500 }}
                theme="dark"
                transparent={true}
                noFooter={true}
                noScrollbar={true}
            /> </React.Fragment> : <React.Fragment>
                    <Friends />
                    <Team />
                    <Group />
                </React.Fragment>}
        </div>
    );
};
export default RightSidebar;
