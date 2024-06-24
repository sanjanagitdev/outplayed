import React, { useState, useEffect, useContext } from 'react';
import Helmet from 'react-helmet';
import Layout from '../layout/layout';
import premium from '../../assets/home/premium-icon.png';
// import amount from '../../assets/home/3.png';
import { userInstance } from '../../config/axios';
import UserContext from '../../context/context';

import './premium.css';
const Premium = () => {
  const paymentOptionsArray = [
    {
      type: 'Premium- 1Month',
      membershipType: 'premium',
      amount: 8.99,
      cycle: 1,
    },
    {
      type: 'Premium- 3Month',
      amount: 25,
      cycle: 3,
      membershipType: 'premium',
    },
    {
      type: 'Premium- 6Month',
      amount: 50,
      cycle: 6,
      membershipType: 'premium',
    },
  ];
  const {
    userDetails: { ispremium },
    setGlobalLoader,
  } = useContext(UserContext);
  const subScription = async (planname, price, membershipType, cycle) => {
    const plannData = {
      planname: planname,
      price: price,
      membershipType: membershipType,
      cycle: cycle,
    };
    setGlobalLoader(true);
    const response = await userInstance().post('/addsubScription', {
      plannData,
    });
    let { code, link } = response.data;
    if (code === 200) {
      window.location.href = link;
    } else {
      setGlobalLoader(false);
    }
  };
  return (
    <>
      <Helmet>
        <body className="premium-main-page" />
      </Helmet>
      <Layout header={true} footer={true}>
        <div className="main-wrapper">
          <div className="middle-wrapper">
            <div className="premium-page">
              <div className="incident-heading">
                <h1>Welcome to the Premium section</h1>
              </div>
              <div className="premium-image-section">
                <img src={premium} alt="premiumimage" />
                <h6>
                  ACCESS THE ADVANTAGES OF BEING <span>PREMIUM</span> and
                  discover everything that can
                </h6>
              </div>
              <div className="premium-bottom">
                <h6>
                  INCLUDES ADVANTAGES FOR CONTENT CREATORS AND MUCH MORE, DO NOT
                  MISS THIS INTERESTING PROMOTION and MAKE A PARTY TO YOUR STAY
                  IN outplayed, ACCESS TO JUICY PRIZES AND ORGANIZED TOURNAMENTS
                  ONLY FOR OUR PREMIUM COMMUNITY
                </h6>
              </div>
              <div className="premium-limit">
                {paymentOptionsArray.map((el, i) => {
                  return (
                    <div className="premium-one">
                      <div className="premium-month">
                        <h6>{el.type}</h6>
                      </div>
                      {ispremium ? (
                        <div className="premium-amount">
                          <h6>
                            {el.amount}{' '}
                            <i class="fa fa-eur" aria-hidden="true"></i>
                          </h6>
                        </div>
                      ) : (
                        <div
                          className="premium-amount premium "
                          onClick={(e) =>
                            subScription(
                              el.type,
                              el.amount,
                              el.membershipType,
                              el.cycle
                            )
                          }
                        >
                          <h6>
                            {el.amount}{' '}
                            <i class="fa fa-eur" aria-hidden="true"></i>
                          </h6>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
export default Premium;
