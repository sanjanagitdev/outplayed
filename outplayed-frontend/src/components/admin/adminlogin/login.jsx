import React, { useState } from "react";
import Helmet from 'react-helmet';
import { Form, Button } from 'react-bootstrap';
import { adminInstance } from '../../../config/axios';
import { Notification } from '../../../function';


const AdminLogin = () => {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const login = async e => {
        e.preventDefault();
        let payload = {
            username,
            password
        };
        let loginUser = await adminInstance().post("/login", payload);
        let { code, msg, token } = loginUser.data;
        if (code === 200) {
            localStorage.setItem('webadmintoken', token);
            window.location.href = "/admin/dashboard"
            //Notification("success", msg);
        } else {
            Notification("danger", msg);
        }
    };
    return (
        <div className="admin-login">
            <Helmet>
                <body className="admin-view" />
            </Helmet>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="admin-login-box">
                            <h2>Admin Login</h2>
                            <Form onSubmit={login}>
                                <Form.Group controlId="formBasicloginone">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Username"
                                        name="username"
                                        autoComplete="off"
                                        value={username}
                                        required={true}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        name="password"
                                        autoComplete="off"
                                        required={true}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <div className="login-button">
                                    <Button type="submit" className="l-btn" >
                                        Login
                                        </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;