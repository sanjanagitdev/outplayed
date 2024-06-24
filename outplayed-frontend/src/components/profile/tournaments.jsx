import React, { useContext } from 'react';

import profile from '../../assets/icons/solo.png';
import premium from '../../assets/icons/newpremium.png';
import advance from '../../assets/icons/new-advanced.png';
import group from '../../assets/icons/Group.png';
// import prestige from '../../assets/prestigios/Prestigio IX_Mesa de trabajo 1.png';
import UserProfileContext from './../../context/profilecontext';

const Tournaments = () => {
  const { tournaments } = useContext(UserProfileContext);

  return (
    <div className="tournaments-section">
      <h6 className="last-tournament-table">TOURNAMENTS</h6>
      {tournaments &&
        tournaments.map((el, i) => {
          return <TournamentItem element={el} index={i} />;
        })}
    </div>
  );
};
export default Tournaments;

const TournamentItem = ({ element, index }) => {
  const {
    title,
    banner,
    gameType,
    tournamentType,
    playerJoined,
    playerNumbers,
    tournamentStarted,
    tournamentEnd,
    tournamentPrize,
  } = element ? element : {};

  const GetTournaType = (type) => {
    if (type === 'Advanced') {
      return advance;
    } else if (type === 'Premium') {
      return premium;
    }
  };
  const isActvie = tournamentStarted && tournamentEnd ? 'Ended' : 'Running';
  return (
    <div className="last-tournament-body" key={index}>
      <h6>
        <img src={banner ? banner : profile} alt="profile" />
        {title}
      </h6>
      <h6>
        {tournamentType !== 'Normal' ? (
          <img src={GetTournaType(tournamentType)} alt="profile" />
        ) : (
          'Normal'
        )}
      </h6>
      <h6>{gameType}</h6>
      <h6>{isActvie}</h6>
      <h6>Prize {tournamentPrize}</h6>
      <h6>
        {playerJoined.length}/ {playerNumbers}
        <img src={group} alt="profile" />
      </h6>
    </div>
  );
};
