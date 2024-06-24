import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import logo from '../../assets/logo/logo.png';
import { userInstance } from '../../config/axios';
import { Notification, validateReset, queryString } from '../../function';
export const ResetPopup = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} dialogClassName="outlayed-popup">
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <ResetPopups handleClose={handleClose} />
      </Modal.Body>
    </Modal>
  );
};
const ResetPopups = ({ handleClose }) => {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errors, setErrors] = useState('');
  const [lock, setLock] = useState(false);
  const forget = async (e) => {
    e.preventDefault();
    const { forgethash } = queryString();
    let payload = {
      password,
      repeatPassword,
      token: forgethash,
    };
    const { errors, isValid } = validateReset(payload);
    setErrors(errors);
    if (!isValid) {
      return;
    }
    setLock(true);
    let response = await userInstance().post('/reset', payload);
    let { code, msg } = response.data;
    if (code === 200) {
      Notification('success', msg);
      window.history.pushState('page1', 'title', '/');
      handleClose();
      setLock(false);
    } else {
      Notification('danger', msg);
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
                <Form.Label>Enter PASSWORD</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <span style={{ color: 'red' }}>{errors.password}</span>
                )}
              </Form.Group>
              <Form.Group controlId="formBasicloginone">
                <Form.Label>Enter REPEAT PASSWORD</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  name="repeatPassword"
                  autoComplete="off"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
                {errors.repeatPassword && (
                  <span style={{ color: 'red' }}>{errors.repeatPassword}</span>
                )}
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
