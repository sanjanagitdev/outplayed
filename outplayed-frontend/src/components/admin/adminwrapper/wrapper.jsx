import React, { useEffect, useState } from "react";
import Helmet from 'react-helmet';
import "../admin.css";
import AdminHeader from "../adminheader/header";
import AdminMenu from "../adminmenu/menu";
import { adminInstance } from "../../../config/axios";
import history from "../../../config/history";



const AdminWrapper = (props) => {

    const [menutoggle, setMenuToggle] = useState(false);

    const checkAuthFunction = async () => {
        try {
            if (localStorage.getItem('webadmintoken')) {
                const response = await adminInstance().get('/checkauth');
                const { data: { code } } = response;
                if (code !== 200) {
                    localStorage.removeItem('webadmintoken');
                    history.push("/admin");
                }
            }
        } catch (e) {
            return
        }
    }
    useEffect(() => {
        checkAuthFunction();
    }, []);

    return (
        <div className="admin-wrapper">
            <Helmet>
                <body className="admin-view" />
            </Helmet>


            <div className="admin-content-view">

                <AdminMenu menutoggle={menutoggle} />

                <div className={`admin-container ${menutoggle ? `wrapper-expand` : ``}`}>
                    <div className="header-view">
                        <AdminHeader setMenuToggle={setMenuToggle} menutoggle={menutoggle} />
                    </div>

                    <div className="admin-content">
                        {props.children}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default AdminWrapper;
