import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import logo from "../../assets/logo/logo.png";
import { Link } from 'react-router-dom';
import { STEAM_URL } from '../../config/keys';
import { userInstance } from '../../config/axios';
import Loader from '../loader/loader';
import { Notification, validateRegister, validateLogin, setRemember, getRemember, clearRemember } from '../../function';
export const LoginPopup = ({ show, handleClose, handleShowForget }) => {
    return <Modal show={show} onHide={handleClose} dialogClassName="outlayed-popup">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
            <LoginPopups handleClose={handleClose} handleShowForget={handleShowForget} />
        </Modal.Body>
    </Modal>
}
const LoginPopups = ({ handleClose, handleShowForget }) => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [checked, setChecked] = useState(false);
    const [errors, setErrors] = useState("");

    const login = async e => {
        e.preventDefault();
        let payload = {
            email,
            password
        };
        const { loginerrors, isValid } = validateLogin(payload);
        setErrors(loginerrors);
        if (!isValid) {
            return;
        }
        let loginUser = await userInstance().post("/login", payload);
        let { code, msg, token, userid } = loginUser.data;
        if (code === 200) {
            localStorage.setItem('webtoken', token);
            localStorage.setItem('userid', userid);
            if (checked) {
                setRemember(email, password, checked);
            } else {
                clearRemember();
            }
            window.location.href = "/";
            handleClose();
        } else {
            Notification("danger", msg);
        }

    };
    useEffect(() => {
        const response = getRemember();
        if (response) {
            const { email, password } = response;
            setChecked(true);
            setEmail(email);
            setPassword(password);
        }
    }, [])
    return (
        <div className="login-popup">
            <div className="login-form">
                <div className="popup-logo">
                    <img src={logo} alt="Logo" />
                </div>
                <Form onSubmit={login}>
                    <div className="row">
                        <div className="col-md-12">
                            <Form.Group controlId="formBasicloginone">
                                <Form.Label>Enter Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Email"
                                    name="email"
                                    autoComplete="off"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
                            </Form.Group>
                        </div>
                        <div className="col-md-12">
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Enter Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    autoComplete="off"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {errors.password && <span style={{ color: "red" }}>{errors.password}</span>}
                            </Form.Group>
                        </div>
                        <div className="col-md-12">
                            <div className="forget-password">
                                <Form.Check type="checkbox" checked={checked} onChange={() => setChecked(!checked)} label="Remember Me" />
                                <Link className="forget-link" onClick={handleShowForget}>
                                    Forget Password ?
                        </Link>
                            </div>
                            <div className="login-button">
                                <Button type="submit" className="login-btn" >
                                    Login
                        </Button>
                            </div>
                            <div className="social-login">
                                <span>OR</span>
                                <SteamLoginButton type={'Login'} />
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
};
export const RegistrationPopup = ({ view, handleViewClose }) => {
    return <Modal show={view} onHide={handleViewClose} dialogClassName="outlayed-popup">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
            <RegisterPopup handleViewClose={handleViewClose} />
        </Modal.Body>
    </Modal>
}
const RegisterPopup = ({ handleViewClose }) => {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [lock, setLock] = useState(false);
    const [errors, setErrors] = useState({});
    const [isChecked, setIsChecked] = useState(false);

    const signUp = async e => {
        e.preventDefault();
        let id = localStorage.getItem('inviteid')
        let payload = {
            username, email, password, id: id ? id : null
        };
        const { errors, isValid } = validateRegister({
            username: username,
            email: email,
            password: password,
            repeatPassword: repeatPassword,
            isChecked: isChecked
        });
        setErrors(errors);
        if (!isValid) {
            return;
        }
        setLock(true);
        let saveData = await userInstance().post("/register", payload);
        let { code, msg } = saveData.data;
        if (code === 200) {
            setUserName("");
            setEmail("");
            setPassword("");
            setRepeatPassword("");
            handleViewClose();
            Notification("success", msg);
            setLock(false);
        } else {
            setLock(false);
            Notification("danger", msg);
        }
    };

    return (
        <div className="register-popup">
            {lock && <Loader />}
            <div className="login-form">
                <div className="popup-logo">
                    <img src={logo} alt="Logo" />
                </div>
                <Form onSubmit={signUp}>
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group controlId="formBasicloginone">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="name"
                                    placeholder="Username"
                                    name="name"
                                    autoComplete="off"
                                    value={username}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                                {errors.username && <span style={{ color: "red" }}>{errors.username}</span>}
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="formBasicloginone">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Email"
                                    name="email"
                                    autoComplete="off"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
                            </Form.Group>
                        </div>
                        <div className="col-md-12">
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    autoComplete="off"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {errors.password && <span style={{ color: "red" }}>{errors.password}</span>}
                            </Form.Group>
                        </div>
                        <div className="col-md-12">
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm password"
                                    name="confirmpassword"
                                    autoComplete="off"
                                    value={repeatPassword}
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                />
                                {errors.repeatPassword && <span style={{ color: "red" }}>{errors.repeatPassword}</span>}
                            </Form.Group>
                        </div>
                        <div className="col-md-12">
                            <div className="forget-password">
                                <Form.Group controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} label="I accept Terms & Conditions" />
                                    {errors.isChecked && <span style={{ color: "red" }}>{errors.isChecked}</span>}
                                </Form.Group>
                            </div>
                            <div className="login-button">
                                <Button type="submit" className="login-btn" disabled={lock}>
                                    Register
                        </Button>
                            </div>
                            <div className="social-login">
                                <span>OR</span>
                                <SteamLoginButton type={'Register'} />
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
};
const SteamLoginButton = ({ type }) => {
    return <div className="social-media">
        <Button className="steam-login" onClick={() => window.location.href = STEAM_URL}><i className="fa fa-steam"></i> {type} with Steam</Button>
    </div>
}