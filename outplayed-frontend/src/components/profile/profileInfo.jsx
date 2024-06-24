import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import Slider from 'react-slick';

import UserProfileContext from './../../context/profilecontext';
import { CalculatePrestigeFrom, CalculateAgeFunction } from '../../function';

const ProfileInfo = () => {
  const { profileData } = useContext(UserProfileContext);

  const {
    dob,
    nickname,
    nationality,
    joined_at,
    username,
    prestige,
    mainteam,
  } = profileData ? profileData : {};

  const feature = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: prestige === 1000 ? 1 : 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="profile-info-page">
      <div className="left-profile-section">
        <div className="left-profile-info">
          <div className="profile-details">
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                value={username ? username : 'Not Found'}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>NATIONALITY:</Form.Label>
              <Form.Control
                type="text"
                value={nationality ? nationality : 'Not Found'}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>nick:</Form.Label>
              <Form.Control
                type="text"
                value={nickname ? nickname : 'Not Found'}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>age:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email"
                value={CalculateAgeFunction(dob)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>MAIN TEAM:</Form.Label>
              <Form.Control
                type="text"
                value={mainteam ? mainteam : 'Not Found'}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>MEMBER SINCE:</Form.Label>
              <Form.Control
                type="text"
                value={new Date(joined_at).toLocaleString()}
              />
            </Form.Group>
          </div>
        </div>
        <div className="profile-details-content">
          <h6>Extra Information</h6>
          <p>
            Lorem ipsum pain sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labor et pain magna aliqua. Quis ipsum
            suspendisse ultrices gravida. Risus commodo viverra maecenas
            accumsan lacus vel facilisis.
          </p>
        </div>
      </div>
      <div className="right-profile-info">
        <h6>badges and awards</h6>
        <div className="badges-section">
          <div className="feature-slider">
            <Slider {...feature}>
              {CalculatePrestigeFrom(prestige).map((el) => {
                return (
                  <div className="home-slider-img">
                    <img src={el} alt="" />
                    <div className="slider-content">prestige vIII</div>
                  </div>
                );
              })}
            </Slider>
          </div>
          <div className="slider-image-options">
            <div className="option-one">
              {CalculatePrestigeFrom(prestige)
                .slice(0, 4)
                .map((el) => {
                  return (
                    <div className="option-img">
                      <img src={el} alt="slider-option" />
                    </div>
                  );
                })}
            </div>
            <div className="option-two">
              {CalculatePrestigeFrom(prestige)
                .slice(4, 8)
                .map((el) => {
                  return (
                    <div className="option-img">
                      <img src={el} alt="slider-option" />
                    </div>
                  );
                })}
            </div>
            <div className="option-three">
              {CalculatePrestigeFrom(prestige)
                .slice(8, 10)
                .map((el) => {
                  return (
                    <div className="option-img">
                      <img src={el} alt="slider-option" />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileInfo;
