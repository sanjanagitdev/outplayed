import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from 'react-bootstrap';
import news from "../../assets/menu/news.png";
import hubs from "../../assets/menu/hubs.png";
import matchmaking from "../../assets/menu/matchmaking.png";

const Supportleft = () => {
  return (
    <div className="support-left">
      <div className="main-menu">
        <Nav>
          <NavLink exact className="nav-link" to="/support-listing">
            <img src={news} alt="News" /> <span>All (20)</span>
          </NavLink>
          <NavLink className="nav-link" to="/support-listing">
            <img src={hubs} alt="Hubs" /> <span>New (5)</span>
          </NavLink>
          <NavLink className="nav-link" to="/support-listing">
            <img src={matchmaking} alt="Matchmaking" /> <span>Answered (10)</span>
          </NavLink>
          <NavLink className="nav-link" to="/support-listing">
            <img src={matchmaking} alt="Matchmaking" /> <span>closed (5)</span>
          </NavLink>
        </Nav>
      </div>
    </div>
  );
};
export default Supportleft;
