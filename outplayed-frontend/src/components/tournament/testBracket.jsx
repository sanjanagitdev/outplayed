import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { GetWinnerTWinnerPanelData, GetPrestigeAccPoint } from "../../function";
import playericon from '../../assets/tournament/group-user-icon.png';
import trophy from '../../assets/tournament/feature-icon-2.png';
import coin from '../../assets/tournament/money-icon.png';
import prestigio from '../../assets/tournament/Prestigio.png';


const TournamentTestBrakets = ({ tournamentData, BracketData }) => {
    const { tournamentEnd, tournamentPrize } = tournamentData;
    const handleOpenRoom = (roomid) => {
        const win = window.open(`/tournamentroom/?id=${roomid}`, "_blank");
        win.focus();
    }
    return (

        <TransformWrapper>
            <TransformComponent>
                <div className="tournament-bracket">
                    {tournamentEnd ? <React.Fragment>
                        {BracketData.length > 0 && BracketData.map((a, i, array) => {
                            return <React.Fragment> {Object.values(a)[0].length > 0 ? <TournamentRoundsPanel element={Object.values(a)[0]} index={i} handleOpenRoom={handleOpenRoom} /> : <React.Fragment>{Object.values(array[i - 1])[0].length > 0 && <WinnerPanel elements={Object.values(array[i - 1])[0]} tournamentPrize={tournamentPrize} />}</React.Fragment>}</React.Fragment>
                        })}
                    </React.Fragment> : <div className='not-disclosed'><h4>Currently brackets are not disclosed !!</h4></div>}
                </div>
            </TransformComponent>
        </TransformWrapper>
    );
};
export default TournamentTestBrakets;

const WinnerPanel = ({ elements, tournamentPrize }) => {
    const { username, useravatar, prestige } = GetWinnerTWinnerPanelData(elements[0]);
    return <div class="tournament-bracket-box tournament-winner">
        <div className="tw-box">
            <div className="tw-upper">
                <div className="winner-icon">
                    <img src={trophy} />
                </div>
                <h3>Tournament Winner</h3>
            </div>
            <div className="tw-middle">
                {username}
            </div>
            <div className="tw-lower">
                <div className="player-icon">
                    <img src={useravatar ? useravatar : playericon} />
                    <img src={GetPrestigeAccPoint(prestige ? prestige : 1000)} />
                </div>
                <div className="prize">
                    <h3>Prize:</h3>
                    <span>{tournamentPrize}
                        <img src={coin} />
                    </span>
                </div>
            </div>
        </div>
    </div>
}

const TournamentRoundsPanel = ({ element, index, handleOpenRoom }) => {
    return <div class="tournament-bracket-box" key={index}>
        <ul class="tournament-bracket-list">
            {element.map((items, jindex) => {
                return <PlyaerGameItem items={items} jindex={jindex} handleOpenRoom={handleOpenRoom} />
            })}
        </ul>
    </div>
}

const PlyaerGameItem = ({ items, jindex, handleOpenRoom }) => {
    const { team1: { userid: { username, useravatar }, result: { result } }, team2: { userid: { username: username1, useravatar: useravatar1 }, result: { result: result1 } }, roomid } = items;
    return <li class="tournament-bracket-item" key={jindex} onClick={() => handleOpenRoom(roomid)}>
        {/* tournament-bracket-content yellow-border light-green */}
        <div class={`tournament-bracket-content ${result === 'win' ? 'yellow-border' : null}`}>
            <div className="player-icon">
                <img src={useravatar ? useravatar : playericon} />
            </div>
            <h3>{username}</h3>
        </div>
        <div class={`tournament-bracket-content ${result1 === 'win' ? 'yellow-border' : null}`}>
            <div className="player-icon">
                <img src={useravatar1 ? useravatar1 : playericon} />
            </div>
            <h3>{username1}</h3>
        </div>
    </li>
}