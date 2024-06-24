import React, { useContext, useState } from 'react';
import { Dropdown, ProgressBar } from "react-bootstrap"
import UserContext from "../../context/context";
import Layout from '../layout/layout';
import LeftSidebar from '../sidebar/leftsidebar';
import RightSidebar from '../sidebar/rightsidebar';
import './statistics.css';
import teamicon from '../../../src/assets/team/user-icon.png';
import prestige from '../../assets/prestigios/Prestigio VIII_Mesa de trabajo 1.png';
import prestige1 from '../../assets/prestigios/Prestigio IX_Mesa de trabajo 1.png';
import advance from '../../assets/matchmaking/advanced.png';
import premium from '../../assets/matchmaking/premium.png';
import friend from '../../assets/friend/main-bg.jpg';
import locksm from '../../assets/icons/smlock.png';
import lock from '../../assets/icons/lock.png';
import { userInstance } from '../../config/axios';
import { GetNextPrestige, GetPrestigeAccPoint } from "../../function";

const Statistics = () => {
  const { userDetails: { username, useravatar, ispremium, ispremiumadvnaced, prestige: prestige5vs5, prestige1vs1 }, userStats, selectedGame, padLock, selectForCompare, opponentStats, setSelectedGame, opponentStatsObject } = useContext(UserContext);
  const [profileList, setProfiles] = useState([]);

  const getProfiles = async (e) => {
    try {
      const { value } = e.target;
      if (value.trim()) {
        const response = await userInstance().get(`/searchuser/${value}`);
        const { data: { code, profileList } } = response;
        if (code === 200) {
          setProfiles(profileList);
        }
      } else {
        setProfiles([])
      }
    } catch (error) {
      return error;
    }
  }

  const selectMember = (id) => {
    selectForCompare(id)
    setProfiles([])
  }
  return (
    <Layout header={true} footer={true}>
      <div className="statistics-page">
        <div className="main-wrapper">
          <LeftSidebar
            mainmenu={true}
            increase={true}
            community={true}
            voiceserver={true}
          />
          <div className="middle-wrapper">
            <div className="statistics">
              <div className="statistics-main">
                {/* Current user stats section */}
                <div className="left-side-statistics">
                  <div className="profile-statistics">
                    <div className="statistics-profile-left">
                      <img src={useravatar ? useravatar : teamicon} alt="team" />
                      <p>{userStats[9] ? userStats[9].totalgames : 0} played games</p>
                      <p>Mvp: 0</p>
                    </div>
                    <div className="statistics-profile-right">
                      <div className="player-name ">
                        <h6>{username}</h6>
                      </div>
                      <ProgressBarPrestige prestigevalue={selectedGame === '1vs1' ? prestige1vs1 : prestige5vs5} />

                    </div>
                  </div>
                  <div className="player-win">
                    <div className="player-border">
                      <div className="playerwin">
                        <h6>
                          Wins: <span>{userStats[1] ? userStats[1].win : 0}</span>
                        </h6>
                      </div>
                      <div className="player-loss">
                        <h6>
                          Loses: <span>{userStats[0] ? userStats[0].loss : 0}</span>
                        </h6>
                      </div>
                      <div className="player-winrate">
                        <h6>
                          Win rate:
                      </h6>
                      </div>
                    </div>
                    <div className="player-winrate">
                      <h6>
                        <span>{userStats[8] ? userStats[8].winpercent : 0}%</span>
                      </h6>
                    </div>
                  </div>
                  <div className="add-player-premium">
                    <div className="advance-premium">

                      {ispremium && <div className="advance">
                        <img src={advance} alt="advnc" />
                        Advance
                      </div>}

                      {ispremiumadvnaced && <div className="premium">
                        <img src={premium} alt="advnc" />
                        Premium
                      </div>}

                    </div>
                    {/* <div className="statistics-add-friend">
                      <i class="fa fa-thumbs-up" aria-hidden="true"></i> Add
                      Friend
                    </div> */}
                    <div className="statistics-like">
                      <i class="fa fa-thumbs-up" aria-hidden="true"></i> 0
                    </div>
                    <div className="statistics-total">
                      <i class="fa fa-users" aria-hidden="true"></i> 0
                    </div>
                  </div>
                </div>
                {/* ------------- End current user stats scetion --------- */}

                {/* Opponent user stats */}
                <div className={`right-side-statistics ${!padLock && 'padlock-section'}`}>
                  {!padLock && <img src={lock} className="lock-bg" />}
                  <div className="profile-statistics">
                    <div className="statistics-profile-left">
                      <img src={opponentStatsObject.useravatar ? opponentStatsObject.useravatar : teamicon} alt="team" />
                      <p>{opponentStats[9] ? opponentStats[9].totalgames : 0} played games</p>
                      <p>Mvp: 0</p>
                    </div>
                    <div className="statistics-profile-right">
                      <div className="player-name player-name-name">
                        <h6>{opponentStatsObject.username}</h6>
                      </div>

                      <ProgressBarPrestige prestigevalue={selectedGame === '1vs1' ? opponentStatsObject.prestige1vs1 : opponentStatsObject.prestige} />

                    </div>
                  </div>
                  <div className="player-win">
                    <div className="player-border">
                      <div className="playerwin">
                        <h6>
                          Wins: <span>{opponentStats[1] ? opponentStats[1].win : 0}</span>
                        </h6>
                      </div>
                      <div className="player-loss">
                        <h6>
                          Loses: <span>{opponentStats[0] ? opponentStats[0].loss : 0}</span>
                        </h6>
                      </div>
                      <div className="player-winrate">
                        <h6>
                          Win rate:
                      </h6>
                      </div>
                    </div>
                    <div className="player-winrate">
                      <h6>
                        <span>{opponentStats[8] ? opponentStats[8].winpercent : 0}%</span>
                      </h6>
                    </div>
                  </div>

                  <div className="add-player-premium">
                    <div className="advance-premium">
                      {opponentStatsObject.ispremiumadvnaced && <div className="advance">
                        <img src={advance} alt="advnc" />
                        Advance
                      </div>}
                      {opponentStatsObject.ispremium && <div className="premium">
                        <img src={premium} alt="advnc" />
                        Premium
                      </div>}
                    </div>
                    <div className="statistics-add-friend">
                      <i class="fa fa-thumbs-up" aria-hidden="true"></i> Add
                      Friend
                    </div>
                    <div className="statistics-like">
                      <i class="fa fa-thumbs-up" aria-hidden="true"></i> 0
                    </div>
                    <div className="statistics-total">
                      <i class="fa fa-users" aria-hidden="true"></i> 0
                    </div>
                  </div>
                </div>
                {/* End opponent section */}
              </div>
              {/* -------------- Middle component -------------*/}
              <div className="search-listing">
                <div className="statistics-search-left">
                  {!padLock && <div className="premium-box">
                    <img src={locksm} alt="lock image" />
                    <h6>It is required to be <span> premium </span> to see the blocked functions</h6>
                  </div>}
                </div>

                <div className={`statistics-search-right ${!padLock && 'padlock-section'}`}>
                  <i class="fa fa-search" aria-hidden="true"></i>
                  <input type="search" placeholder="search Player" onChange={getProfiles} />
                  {profileList.length > 0 && <div className="search-list search-list-team stats-search">
                    <div className="list">
                      {profileList.map((el, i) => {
                        return <ListItem2 element={el} index={i} selectMember={selectMember} />
                      })}
                    </div>
                  </div>}
                  {!padLock && <img src={lock} alt="lock image" />}
                  <div className="searchbtn">
                    <button type="submit">Random search</button>
                    <Dropdown className="search-icon-btn">
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {selectedGame}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setSelectedGame('5vs5')}>5vs5</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSelectedGame('1vs1')}>1vs1</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>
              {/* -------- Middle component end ------------*/}

              {/*------- Players component stats list Both--------*/}
              <div className="listing-player">
                <div className="listing-player-list">
                  <div className="player-list-left">
                    <div className="player-list-one">
                      <div className="player-name">K/D Ratio</div>
                      <div className={`player-ratio ${userStats[5] ? userStats[5].class : 0}`}>{userStats[5] ? userStats[5].KDR : 0}</div>
                    </div>
                  </div>
                  <div className="player-list-middle">
                    <div className="playervs">VS</div>
                  </div>
                  <div className="player-list-right">
                    <div className="player-list-two">
                      <div className={`player-ratio ${opponentStats[5] ? opponentStats[5].class : 0}`}>{opponentStats[5] ? opponentStats[5].KDR : 0}</div>
                      <div className="player-name">K/D Ratio</div>
                    </div>
                  </div>
                </div>
                <div className="listing-player-list">
                  <div className="player-list-left">
                    <div className="player-list-one">
                      <div className="player-name">DMG/Round</div>
                      <div className="player-ratio no">0%</div>
                    </div>
                  </div>
                  <div className="player-list-middle">
                    <div className="playervs">VS</div>
                  </div>
                  <div className="player-list-right">
                    <div className="player-list-two">
                      <div className="player-ratio no">0%</div>
                      <div className="player-name">DMG/Round</div>
                    </div>
                  </div>
                </div>
                <div className="listing-player-list">
                  <div className="player-list-left">
                    <div className="player-list-one">
                      <div className="player-name">Kills</div>
                      <div className={`player-ratio ${userStats[3] ? userStats[3].class : 0}`}>{userStats[3] ? userStats[3].kills : 0}</div>
                    </div>
                  </div>
                  <div className="player-list-middle">
                    <div className="playervs">VS</div>
                  </div>
                  <div className="player-list-right">
                    <div className="player-list-two">
                      <div className={`player-ratio ${opponentStats[3] ? opponentStats[3].class : 0}`}>{opponentStats[3] ? opponentStats[3].kills : 0}</div>
                      <div className="player-name">Kills</div>
                    </div>
                  </div>
                </div>
                <div className="listing-player-list">
                  <div className="player-list-left">
                    <div className="player-list-one">
                      <div className="player-name">deaths</div>
                      <div className={`player-ratio ${userStats[4] ? userStats[4].class : 0}`}>{userStats[4] ? userStats[4].death : 0}</div>
                    </div>
                  </div>
                  <div className="player-list-middle">
                    <div className="playervs">VS</div>
                  </div>
                  <div className="player-list-right">
                    <div className="player-list-two">
                      <div className={`player-ratio ${opponentStats[4] ? opponentStats[4].class : 0}`}>{opponentStats[4] ? opponentStats[4].death : 0}</div>
                      <div className="player-name">Deaths</div>
                    </div>
                  </div>
                </div>
                {selectedGame === "5v5" && <div className="listing-player-list">
                  <div className="player-list-left">
                    <div className="player-list-one">
                      <div className="player-name">Assits per game</div>
                      <div className={userStats[12] ? userStats[12].class : 'no'}>{userStats[12] ? userStats[12].assists_per : 0}</div>
                    </div>
                  </div>
                  <div className="player-list-middle">
                    <div className="playervs">VS</div>
                  </div>
                  <div className="player-list-right">
                    <div className="player-list-two">
                      <div className={`player-ratio ${opponentStats[12] ? opponentStats[12].class : 'no'}`}>{opponentStats[12] ? opponentStats[12].assists_per : 0}</div>
                      <div className="player-name">Assits per game</div>
                    </div>
                  </div>
                </div>}

                <div className="listing-player-list">
                  <div className="player-list-left">
                    <div className="player-list-one">
                      <div className="player-name">%headshot</div>
                      {!padLock ? <div className="lock-images">
                        <img src={lock} alt="lock image" />
                      </div> : <div className={`player-ratio ${userStats[6] ? userStats[6].class : 0}`}> {userStats[6] ? userStats[6].headshot_per : 0}</div>}
                    </div>
                  </div>
                  <div className="player-list-middle">
                    <div className="playervs">VS</div>
                  </div>
                  <div className="player-list-right">
                    <div className="player-list-two">
                      <div className={`player-ratio ${opponentStats[6] ? opponentStats[6].class : 0}`}> {opponentStats[6] ? opponentStats[6].headshot_per : 0}</div>
                      <div className="player-name">%headshot</div>
                    </div>
                  </div>
                </div>
                {/* 5vs5 */}
                {selectedGame === '5vs5' && <div className="listing-player-list">
                  <div className="player-list-left">
                    <div className="player-list-one">
                      <div className="player-name">clutchs</div>
                      {!padLock ? <div className="lock-images">
                        <img src={lock} alt="lock image" />
                      </div> : <div className={`player-ratio ${userStats[11] ? userStats[11].class : 0}`}>
                          {userStats[11] ? userStats[11].clutch_won : 0}
                        </div>}

                    </div>
                  </div>
                  <div className="player-list-middle">
                    <div className="playervs">VS</div>
                  </div>
                  <div className="player-list-right">
                    <div className="player-list-two">
                      <div className={`player-ratio ${opponentStats[11] ? opponentStats[11].class : 0}`}>
                        {opponentStats[11] ? opponentStats[11].clutch_won : 0}
                      </div>
                      <div className="player-name">clutchs</div>
                    </div>
                  </div>
                </div>}
                <div className="listing-player-list">
                  <div className="player-list-left">
                    <div className="player-list-one">
                      <div className="player-name">Longest winnnig streak</div>
                      {!padLock ? <div className="lock-images">
                        <img src={lock} alt="lock image" />
                      </div> : <div className={`player-ratio ${userStats[10] ? userStats[10].class : 0}`}>
                          {userStats[10] ? userStats[10].streaks : 0}
                        </div>}
                    </div>
                  </div>
                  <div className="player-list-middle">
                    <div className="playervs">VS</div>
                  </div>
                  <div className="player-list-right">
                    <div className="player-list-two">
                      <div className={`player-ratio ${opponentStats[10] ? opponentStats[10].class : 0}`}>
                        {opponentStats[10] ? opponentStats[10].streaks : 0}
                      </div>
                      <div className="player-name">Longest winnnig streak</div>
                    </div>
                  </div>
                </div>
                <div className="listing-player-list">
                  <div className="player-list-left">
                    <div className="player-list-one">
                      <div className="player-name">Kills/ round</div>
                      {!padLock ? <div className="lock-images">
                        <img src={lock} alt="lock image" />
                      </div> : <div className={`player-ratio ${userStats[7] ? userStats[7].class : 0}`}>{userStats[7] ? userStats[7].KR : 0}</div>}

                    </div>
                  </div>
                  <div className="player-list-middle">
                    <div className="playervs">VS</div>
                  </div>
                  <div className="player-list-right">
                    <div className="player-list-two">
                      <div className={`player-ratio ${opponentStats[7] ? opponentStats[7].class : 0}`}>{opponentStats[7] ? opponentStats[7].KR : 0}</div>
                      <div className="player-name">Kills/ round</div>
                    </div>
                  </div>
                </div>
                {/* 5vs5 */}
                {selectedGame === "5vs5" && <div className="listing-player-list">
                  <div className="player-list-left">
                    <div className="player-list-one">
                      <div className="player-name">Sucess in entry frages</div>
                      <div className="lock-images">
                        <img src={lock} alt="lock image" />
                      </div>
                    </div>
                  </div>
                  <div className="player-list-middle">
                    <div className="playervs">VS</div>
                  </div>
                  <div className="player-list-right">
                    <div className="player-list-two">
                      <div className=""></div>
                      <div className="player-name">Sucess in entry frages</div>
                    </div>
                  </div>
                </div>}
              </div>

              {/*-------------- Players stats component end ------------*/}

              <div className="player-images">
                <div className="player-one">
                  <img src={friend} alt="" />
                  <div className="player-cont">
                    <img src={lock} alt="lock image" />
                    <h5>50%</h5>
                  </div>
                </div>
                <div className="player-one">
                  <img src={friend} alt="" />
                  <div className="player-cont">
                    <img src={lock} alt="lock image" />
                    <h5>50%</h5>
                  </div>
                </div>
                <div className="player-one">
                  <img src={friend} alt="" />
                  <div className="player-cont">
                    <img src={lock} alt="lock image" />
                    <h5>50%</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <RightSidebar />
        </div>
      </div>
    </Layout>
  );
};
export default Statistics;


const ListItem2 = ({ element, index, selectMember }) => {
  const { username, useravatar, _id } = element;
  return <h6 key={index} onClick={() => selectMember(_id)}><img src={useravatar ? useravatar : teamicon} />{username}</h6>
}

const ProgressBarPrestige = ({ prestigevalue }) => {
  prestigevalue = prestigevalue ? prestigevalue : 1000;
  const nextPrestige = GetNextPrestige(prestigevalue);
  return <div className="profile-bottom">
    <img src={GetPrestigeAccPoint(prestigevalue)} alt="team" /> <div className="progress-tab">
      <h6>{prestigevalue}/{nextPrestige}</h6>
      <div class="progress">
        <ProgressBar now={prestigevalue} max={nextPrestige} variant="warning" />
      </div>
      <h5>Remaining XP for next prestige</h5>
    </div>
    <img src={GetPrestigeAccPoint(nextPrestige)} alt="team" />
  </div>
}