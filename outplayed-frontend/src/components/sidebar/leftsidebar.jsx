import React, {useContext} from "react";
import "./sidebar.css";

import MainMenu from "./mainmenu"
import IncreaseExperience from "./increaseexperience";
import OutplayedCommunity from "./outplayedcommunity";
import VoiceServer from "./voiceservice";
import UserContext from '../../context/context'

const LeftSidebar = ({ mainmenu, increase, community, voiceserver }) => {
  const {menutoggle,setMenuToggle}=useContext(UserContext)

    return (
        <div className={`left-sidebar ${menutoggle ? `sidebar-expand`:``}` }>
        <div className="expand-icon" onClick={() => setMenuToggle(!menutoggle)}>
            <i className="fa fa-plus-square" />
        </div>
            {mainmenu && <MainMenu />}

            {increase && <IncreaseExperience />}

            {community && <OutplayedCommunity />}

            {voiceserver && <VoiceServer />}


        </div>
    );
};
export default LeftSidebar;
