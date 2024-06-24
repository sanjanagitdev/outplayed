import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import logo from "../../assets/logo/logo.png";
import { userInstance } from '../../config/axios';
import { Notification, validateForget } from '../../function';
export const ForgetPopup = ({ show, handleClose }) => {
    return <Modal show={show} onHide={handleClose} dialogClassName="outlayed-popup">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
            <ForgetPopups handleClose={handleClose} />
        </Modal.Body>
    </Modal>
}
const ForgetPopups = ({ handleClose }) => {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState("");
    const [lock, setLock] = useState(false);
    const forget = async e => {
        e.preventDefault();
        let payload = {
            email
        };
        const { errors, isValid } = validateForget(payload);
        setErrors(errors);
        if (!isValid) {
            return;
        }
        setLock(true);
        let response = await userInstance().post("/forgetPass", payload);
        let { code, msg } = response.data;
        if (code === 200) {
            Notification("success", msg);
            handleClose();
            setLock(false);
        } else {
            Notification("danger", msg);
            setLock(false);
        }
    };
    return (
        <div className="login-popup">
            <div className="login-form">
                <div className="popup-logo">
                    <img src={logo} alt="Logo" />
                </div>
                <Form onSubmit={forget}>
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
                            <div className="login-button">
                                <Button type="submit" className="login-btn" disabled={lock}>
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
};