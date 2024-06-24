import React, { useEffect } from "react";
import "../admin.css";
import menu from '../../../assets/admin/menu-icon.png';
import admin from '../../../assets/admin/user.jpg';
import { adminInstance } from "../../../config/axios";
const AdminHeader = ({ setMenuToggle, menutoggle }) => {

    // useEffect(async () => {
    //     if (localStorage.getItem('webadmintoken')) {
    //         const response = await adminInstance().get('/checkauth');
    //         const { data: { code } } = response;
    //         if (code !== 200) {
    //             localStorage.removeItem('webadmintoken');
    //             window.location.href = '/admin'
    //         }
    //     }
    // }, [])

    return (
        <div className="admin-header">

            <div className="menu-toggle">
                <a href="javaScript:void(0)" onClick={() => setMenuToggle(!menutoggle)} >
                    <img src={menu} alt="Menu" />
                </a>
            </div>

            <div className="admin-info">
                <img src={admin} alt="Admin" />
                <h3>Admin</h3>
            </div>

        </div>
    );
};

export default AdminHeader;
