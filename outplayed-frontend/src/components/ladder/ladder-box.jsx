import React from 'react';
import { Button } from 'react-bootstrap';
import cover from "../../assets/tournament/csgo-cover.png";
import time from "../../assets/tournament/time.png";
import player from "../../assets/tournament/player.png";
import prize from "../../assets/tournament/prize.png";
import coin from "../../assets/tournament/money-icon.png";
import csgo from "../../assets/tournament/csgo.png";
import advanced from "../../assets/tournament/advanced.png";
import premium from "../../assets/tournament/premium.png";
import normal from "../../assets/tournament/logo-icon.png";
import '../tournament/tournament.css';
const InitialImages = { 'Normal': normal, "Premium": premium, "Premium/advanced": advanced };
const InitialColor = { 'Normal': "white", "Premium": "#ffd366", "Premium/advanced": "#3f9758" };
const LadderBox = ({ ladders, RegisterInLadders }) => {
    return (
        <div className=" ladder-contentt">
            {ladders && ladders.map((el, index) => {
                return <LadderListItem element={el} index={index} RegisterInLadders={RegisterInLadders} />
            })}


        </div>
    )
}
export default LadderBox;

const LadderListItem = ({ element, index, RegisterInLadders }) => {
    const { title, playerNumbers, gameType, ladderType, ladderStart, banner, ladderPrize, _id } = element;
    const startDataIs = new Date(ladderStart).toLocaleString().split(",");
    return <div className="tournament-box" key={index}>
        <div className="tournament-block" >
            <div className="tournament-info">
                <img src={csgo} alt="logo" className="gameicon" />
                <div className="tournament-cover">
                    <img src={banner ? banner : cover} alt="cover" />
                </div>
                <div className="game-versus">
                    <span>{gameType}</span>
                </div>
            </div>
            <div className="tournament-name">
                <h2>{title}</h2>
            </div>
            <div className="tournament-type normal-game">

                <h3 style={{ color: InitialColor[ladderType] }}><img src={InitialImages[ladderType]} alt="Images" /> {ladderType} Ladder</h3>
            </div>
        </div>
        <div className="tournament-detail">
            <div className="tournament-list">
                <ul>
                    <li><img src={time} alt="time" /> <span>{startDataIs[0]}<p>{startDataIs[1]}</p></span></li>
                    <li><img src={player} alt="player" /> <span>0/{playerNumbers}</span></li>
                    <li><img src={prize} alt="prize" /> <span> {ladderType.toLowerCase() !== 'normal' ? <i class="fa fa-eur" aria-hidden="true"></i> : <img src={coin} alt="coin" />} {ladderPrize}</span></li>
                </ul>
                <Button onClick={() => RegisterInLadders(_id)}>REGISTER</Button>
            </div>
        </div>
    </div>
}