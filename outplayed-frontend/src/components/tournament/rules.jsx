import React from "react";


const TournamentRules = ({ tournamentRules }) => {

    return (
        <div className="tournament-rules custom-scroll">
            <div className="rules-content">
                <h3>Rules</h3>
                {tournamentRules && tournamentRules.map((el, i) => {
                    return <p>{el.tournamentRule}</p>
                })}
                {/* <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Mollitia, itaque cupiditate! Libero eligendi modi ad eius vitae error similique
                aperiam ducimus veniam asperiores adipisci, voluptas quaerat!
                Voluptatum sint sapiente laudantium. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                     Mollitia, itaque cupiditate! Libero eligendi modi ad eius.</p> */}
            </div>
        </div>

    );
};

export default TournamentRules;


