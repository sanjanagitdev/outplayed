import React from 'react';

const Reward = ({ tournamentData }) => {
    const { tournamentEnd } = tournamentData;
    return (
        <div className="reward-main">
            {tournamentEnd ? <div > <h4>Tournament Rewards</h4> </div> : <div className='not-disclosed'> <h4>Tournament rewards are not disclosed now.</h4></div>}
        </div>
    );
}
export default Reward;