import React from 'react';
import matchmaking from '../../assets/menu/matchmaking.png';

const InfoTab = ({ laddersData, playersOrTeamList, selectPlayerFoChallenge }) => {
  const { gameType } = laddersData ? laddersData : {};
  return (
    <div className="info-tab">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <div className="search-area">
              <i class="fa fa-search" aria-hidden="true"></i>
              <input type="search" placeholder="Search player" />
              <button type="submit">
                <i className="fa fa-user" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div className="col-md-12">
            <TableHeadInfo name={gameType === '5vs5' ? 'Teams' : 'Players'} />
            {playersOrTeamList && playersOrTeamList.length > 0 ? (
              playersOrTeamList.map((el, i) => {
                return <ListItem element={el} index={i} selectPlayerFoChallenge={selectPlayerFoChallenge} />;
              })
            ) : (
                <h2>No Players found</h2>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default InfoTab;

const ListItem = ({ element, index, selectPlayerFoChallenge }) => {
  const { name, kills, deaths, kdr, games, wins, loss, winrate, score, _id, creator } = element;
  return (
    <React.Fragment>
      <div className="info-table-section" key={index}>
        <div className="info-table-body player-one player-one-list">
          <div className="info-no">{index + 1}</div>
          <div className="info-players">{name}</div>
          <div className="info-kills">{kills}</div>
          <div className="info-deaths">{deaths}</div>
          <div className="info-kdr">{kdr}</div>
          <div className="info-games">{games}</div>
          <div className="info-wins">{wins}</div>
          <div className="info-loses">{loss}</div>
          <div className="info-winrate">{winrate}</div>
          <div className="info-score">{score}</div>
        </div>
        {localStorage.getItem("userid") !== creator && <div className="checkbox">
          <input type="checkbox" onClick={() => selectPlayerFoChallenge(index)} />
        </div>}

      </div>
    </React.Fragment>
  );
};

const TableHeadInfo = ({ name }) => {
  return <div className="info-table">
    <div className="info-no">
      <img src={matchmaking} alt="ingo" />
    </div>
    <div className="info-players">{name}:</div>
    <div className="info-kills">Kills:</div>
    <div className="info-deaths">Deaths:</div>
    <div className="info-kdr">KDR:</div>
    <div className="info-games">Games:</div>
    <div className="info-wins">Wins:</div>
    <div className="info-loses">Loses:</div>
    <div className="info-winrate">Win Rate:</div>
    <div className="info-score">Score:</div>
  </div>
}