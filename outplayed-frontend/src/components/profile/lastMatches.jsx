import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import UserProfileContext from './../../context/profilecontext';

const LastMatches = () => {
  const { lastResults } = useContext(UserProfileContext);
  return (
    <div className="last-matches-section">
      <h6 className="last-match-table">LAST MATCHES</h6>
      <div className="last-matches-head">
        <h6>PLAYER / TEAM</h6>
        <h6>GAME MODE</h6>
        <h6>Result</h6>
        <h6>OUTCOME</h6>
      </div>
      {lastResults &&
        lastResults.map((el, i) => {
          return <LastMatchItem element={el} index={i} />;
        })}
    </div>
  );
};
export default LastMatches;

const LastMatchItem = ({ element, index }) => {
  const { veds, result, jointype } = element ? element : {};
  return (
    <div className="last-matches-body" key={index}>
      <h6>{veds}</h6>
      <h6>{jointype}</h6>
      <h6>{result}</h6>
      <h6>
        <Button type="submit">watch</Button>
      </h6>
    </div>
  );
};
