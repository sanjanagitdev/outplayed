import React from "react";
import "../admin.css";
import logo from '../../../assets/logo/logo.png';
import { Link } from 'react-router-dom';


const AdminMenu = ({ menutoggle }) => {
    return (
        <div className={`admin-menu ${menutoggle ? `menu-hide` : ``}`}>
            <div className="menu-logo" >
                <img src={logo} alt="logo" />
            </div>
            <div className="admin-menu-box">
                <div className="menu-list">
                    <ul>
                        <li>
                            <Link to="/admin/dashboard">
                                <i className="fa fa-dashboard"></i>
                            Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/user">
                                <i className="fa fa-user"></i>
                            Users
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/category">
                                <i className="fa fa-align-left"></i>
                                News
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/hubslist">
                                <i className="fa fa-align-left"></i>
                                Normal hub
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/maps">
                                <i className="fa fa-power-off"></i>
                                Maps
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/serverslist">
                                <i className="fa fa-power-off"></i>
                                Servers
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/tournament-rules">
                                <i className="fa fa-power-off"></i>
                                Tournament rules
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/tournament">
                                <i className="fa fa-power-off"></i>
                                Tournament
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/supporttickets">
                                <i className="fa fa-power-off"></i>
                                Support Tickets
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/reports">
                                <i className="fa fa-power-off"></i>
                                Reports
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/withdrawrequest">
                                <i className="fa fa-power-off"></i>
                                Withdraw requests
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/store">
                                <i className="fa fa-power-off"></i>
                                Store
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/purchase-items">
                                <i className="fa fa-power-off"></i>
                                Purchase items
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/store/category">
                                <i className="fa fa-power-off"></i>
                                Category
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin" onClick={() => localStorage.removeItem('webadmintoken')}>
                                <i className="fa fa-power-off"></i>
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminMenu;
