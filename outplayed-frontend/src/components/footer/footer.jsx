import React from "react";
import "./footer.css";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import Nav from "react-bootstrap/Nav";
import twitter from "../../assets/social/twitter.png";
import instagram from "../../assets/social/instagram.png";
import youtube from "../../assets/social/youtube.png";
import twitch from "../../assets/social/twitch.png";
const Footer = () => {
    return (
        <div className="footer">

            <div className="footer-logo">
                <img src={logo} alt="logo" />
                <span>Copyright 2020</span>
                <span>All rights reserved</span>
            </div>

            <div className="footer-nav">
                <Nav>
                    <NavLink exact className="nav-link" to="/">Terms and Conditions</NavLink>
                    <NavLink className="nav-link" to="/">Privacy policy</NavLink>
                    <NavLink className="nav-link" to="/">Cookies policy</NavLink>
                    <NavLink className="nav-link" to="/">About us</NavLink>
                </Nav>
            </div>

            <div className="footer-social">
                <ul>
                    <li>
                        <Link to="/"><img src={twitter} alt="twitter" /></Link>
                    </li>
                    <li>
                        <Link to="/"><img src={instagram} alt="Instagram" /></Link>
                    </li>
                    <li>
                        <Link to="/"><img src={youtube} alt="Youtube" /></Link>
                    </li>
                    <li>
                        <Link to="/"><img src={twitch} alt="Twitch" /></Link>
                    </li>
                </ul>
            </div>


        </div>
    );
};

export default Footer;