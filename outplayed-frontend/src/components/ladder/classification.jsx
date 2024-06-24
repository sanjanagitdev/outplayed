import React from 'react';

const Classification = ({ laddersData }) => {
  const {
    ladderStart,
    ladderEndDate,
    gameType,
    playerNumbers,
    playerJoined,
  } = laddersData ? laddersData : {};
  return (
    <div className="classification-tab custom-scroll">
      <div className="classi-content">
        <div className="content-first">
          <h6>
            Start Date: <span>{new Date(ladderStart).toLocaleString()}</span>
          </h6>
        </div>
        <div className="content-first">
          <h6>
            End Date: <span>{new Date(ladderEndDate).toLocaleString()}</span>
          </h6>
        </div>
        <div className="content-first">
          <h6>
            Participants:{' '}
            <span>
              {playerJoined ? playerJoined.length : 0}/{playerNumbers}
            </span>
          </h6>
        </div>
        <div className="content-first">
          <h6>
            Game type: <span>{gameType}</span>
          </h6>
        </div>
      </div>
    </div>
  );
};
export default Classification;
