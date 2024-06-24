import React, { useContext } from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import mapgame from '../../assets/news/detail.jpg';
import arrow from '../../assets/news/news-arrow.png';
import UserProfileContext from './../../context/profilecontext';
const AdvanceStatistics = () => {
  const [seeMoreMap, setSeeMoreMap] = useState(3);
  const { selectedModeData, selectedType, handleSelectType, mostPlayedMaps } =
    useContext(UserProfileContext);

  const {
    gamesplayed,
    winrate,
    longestwinstreak,
    recentresults,
    kd,
    headshotsper,
  } = selectedModeData;

  const seeMoreMaps = () => {
    setSeeMoreMap((pre) => pre + 3);
  };

  const seeLessMpas = () => {
    setSeeMoreMap((pre) => pre - 3);
  };

  return (
    <div className="advance-statistics">
      <div className="advance-list">
        <div className="advance-box">
          <Button type="submit">Advance Statistics</Button>
        </div>
        <div className="player-statistics">
          <h6>PLAYER STATISTICS</h6>
        </div>
        <div className="see-details">
          <h6>see details of:</h6>
          <Button
            type="submit"
            className={`slected ${selectedType}`}
            onClick={() => handleSelectType('1vs1')}
          >
            1VS1
          </Button>
          <Button
            type="submit"
            className={`slected ${selectedType}`}
            onClick={() => handleSelectType('5vs5')}
          >
            5VS5
          </Button>
        </div>
      </div>

      <div className="games-section">
        <div className="games-list">
          <div className="games-box">
            <h6>games played</h6>
            <p>{gamesplayed}</p>
          </div>
          <div className="games-box win-games">
            <h6>win rate</h6>
            <p>{winrate}%</p>
          </div>
          <div className="games-box longest-box">
            <h6>longest streak of victories</h6>
            <p>{longestwinstreak}</p>
          </div>
          <div className="games-box">
            <h6>recent results</h6>
            <p>
              {recentresults.map((el, i, array) => {
                return <WinLossItem element={el} index={i} array={array} />;
              })}
            </p>
          </div>
          <div className="games-box win-games">
            <h6> K / D</h6>
            <p>{kd}</p>
          </div>
          <div className="games-box">
            <h6>headshots</h6>
            <p>{headshotsper}%</p>
          </div>
        </div>
      </div>
      <div className="most-played-map">
        <h4>MOST PLAYED maps</h4>
        <div className="map-section">
          {mostPlayedMaps && mostPlayedMaps.length > 0 ? (
            mostPlayedMaps.slice(0, seeMoreMap).map((el, i) => {
              return <MostPlayedMapItems element={el} index={i} />;
            })
          ) : (
            <div>
              <h6>No data found</h6>
            </div>
          )}
        </div>
        <div className="more-maps">
          {mostPlayedMaps.slice(0, seeMoreMap).length <
          mostPlayedMaps.length ? (
            <Button type="submit" onClick={() => seeMoreMaps()}>
              SEE MORE MAPS <img src={arrow} alt="down-arrow" />{' '}
            </Button>
          ) : (
            <Button type="submit" onClick={() => seeLessMpas()}>
              SEE LESS MAPS <img src={arrow} alt="down-arrow" />{' '}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdvanceStatistics;

const WinLossItem = ({ element, index, array }) => {
  if (element === 'win') {
    return (
      <React.Fragment>
        <span style={{ color: 'green' }} key={index}>
          W{' '}
        </span>
        {array.length - 1 !== index && '/'}{' '}
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <span style={{ color: 'red' }} key={index}>
          L
        </span>{' '}
        {array.length - 1 !== index && '/'}
      </React.Fragment>
    );
  }
};

const MostPlayedMapItems = ({ element, index }) => {
  const { mapname, maps } = element[0] ? element[0] : {};
  const { imgurl } = maps ? maps : {};
  return (
    <div className="map-box-area" key={index}>
      <img src={imgurl ? imgurl : mapgame} alt="map" />
      <div className="map-content">
        <div className="right-map-contnet">
          <h6>{mapname}</h6>
          <p>{element.length}</p>
        </div>
        <div className="right-map-contnet">
          <h6>{mapname}</h6>
          <p>{element.length}</p>
        </div>
      </div>
    </div>
  );
};
