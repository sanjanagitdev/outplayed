import React, { useContext, useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Layout from '../layout/layout';
import LeftSidebar from '../sidebar/leftsidebar';
import RightSidebar from '../sidebar/rightsidebar';
import { Button, Form } from 'react-bootstrap';
import { userInstance } from '../../config/axios';
import { Notification, ValidatePayPalAccount } from '../../function';
import UserContext from '../../context/context';
import './myprofile.css';
const MyProfile = () => {
  const initialState = {
    paypalAccount: '',
    nickname: '',
    dob: '',
    mainteam: '',
    nationality: '',
  };
  const {
    userDetails: { paypalAccount, nickname, dob, mainteam, nationality },
  } = useContext(UserContext);
  const [errors, setErrors] = useState({});
  const [settingState, setSettingState] = useState(initialState);
  useEffect(() => {
    setSettingState({ paypalAccount, nickname, dob, mainteam, nationality });
  }, [paypalAccount, nickname, dob, mainteam, nationality]);

  const handleChange = (e) => {
    console.log(e);
    const { value, name } = e.target;
    setSettingState({ ...settingState, [name]: value });
  };

  const HandleSubmit = async () => {
    try {
      const { isValid, errors } = ValidatePayPalAccount(settingState);
      if (!isValid) {
        setErrors(errors);
        return;
      }
      const response = await userInstance().post(
        '/addPaypalAccount',
        settingState
      );
      const {
        data: { code, msg },
      } = response;
      if (code === 200) {
        Notification('success', msg);
        setErrors({});
      } else {
        Notification('danger', msg);
      }
    } catch (error) {
      return error;
    }
  };

  return (
    <Layout header={true} footer={true}>
      <div className="team-page">
        <div className="main-wrapper">
          <LeftSidebar
            mainmenu={true}
            increase={true}
            community={true}
            voiceserver={true}
          />
          <div className="middle-wrapper">
            <div className="edit-profile-section">
              <div className="row">
                <div className="col-md-12">
                  <Form.Group controlId="formBasicloginone">
                    <Form.Label>
                      {settingState.paypalAccount ? 'Edit' : 'Add'} your paypal
                      account
                    </Form.Label>
                    <Form.Control
                      type="email"
                      value={settingState.paypalAccount}
                      name="paypalAccount"
                      placeholder="Please enter paypal account !!"
                      onChange={(e) => handleChange(e)}
                    />
                    {errors.email && (
                      <Form.Text className="text-danger">
                        {errors.email}
                      </Form.Text>
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="formBasicloginone">
                    <Form.Label>Nationality</Form.Label>
                    <Form.Control
                      type="text"
                      value={settingState.nationality}
                      name="nationality"
                      placeholder="Please enter your country"
                      onChange={(e) => handleChange(e)}
                      maxLength="30"
                    />
                    {errors.nationality && (
                      <Form.Text className="text-danger">
                        {errors.nationality}
                      </Form.Text>
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="formBasicloginone">
                    <Form.Label>Nick name</Form.Label>
                    <Form.Control
                      type="text"
                      value={settingState.nickname}
                      name="nickname"
                      placeholder="Please enter your nickname"
                      onChange={(e) => handleChange(e)}
                      maxLength="30"
                    />
                    {errors.nickname && (
                      <Form.Text className="text-danger">
                        {errors.nickname}
                      </Form.Text>
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="formBasicloginone">
                    <Form.Label>Age</Form.Label>
                    <DatePicker
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      maxDate={new Date()}
                      selected={
                        new Date(
                          settingState.dob ? settingState.dob : new Date()
                        )
                      }
                      onChange={(e) => {
                        handleChange({ target: { name: 'dob', value: e } });
                      }}
                    />
                    {errors.dob && (
                      <Form.Text className="text-danger">
                        {errors.dob}
                      </Form.Text>
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="formBasicloginone">
                    <Form.Label>Main team</Form.Label>
                    <Form.Control
                      type="text"
                      value={settingState.mainteam}
                      name="mainteam"
                      onChange={(e) => handleChange(e)}
                      maxLength="30"
                    />
                    {errors.mainteam && (
                      <Form.Text className="text-danger">
                        {errors.mainteam}
                      </Form.Text>
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-12">
                  <div className="edit-name-btn">
                    <Button onClick={() => HandleSubmit()}>Save</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <RightSidebar />
        </div>
      </div>
    </Layout>
  );
};
export default MyProfile;
