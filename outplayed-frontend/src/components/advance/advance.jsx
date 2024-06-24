import React, { useContext } from 'react';
import Helmet from 'react-helmet';
import Layout from '../layout/layout';
import advance from '../../assets/home/advance-icon.png';
// import amount from '../../assets/home/3.png';
import './advance.css';
import { userInstance } from '../../config/axios';
import UserContext from '../../context/context';
import { Notification } from '../../function/index';

const Advance = () => {
  const paymentOptionsArray = [
    {
      type: 'Advance- 1Month',
      membershipType: 'advance',
      amount: 8.99,
      cycle: 1,
    },
    {
      type: 'Advance- 3Month',
      amount: 25,
      cycle: 3,
      membershipType: 'advance',
    },
    {
      type: 'Advance- 6Month',
      amount: 50,
      cycle: 6,
      membershipType: 'advance',
    },
  ];
  const {
    userDetails: { ispremiumadvnaced },
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
    const { code, link } = response.data;
    if (code === 200) {
      window.location.href = link;
    } else {
      setGlobalLoader(false);
      Notification('danger', 'Some error has occured!');
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
            <div className="premium-page advance-page">
              <div className="incident-heading">
                <h1>Welcome to the Advance section</h1>
              </div>
              <div className="premium-image-section advance-image-section">
                <img src={advance} alt="premiumimage" />
                <h6>
                  ALL <span>ADVANCED</span> OFFERS OFFER THE SAME ADVANTAGES
                  ONLY TIME CHANGES
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
                    <div className="premium-one advance-one" key={i}>
                      <div className="premium-month">
                        <h6>{el.type}</h6>
                      </div>
                      {ispremiumadvnaced ? (
                        <div className="premium-amount">
                          <h6>
                            {el.amount}{' '}
                            <i class="fa fa-eur" aria-hidden="true"></i>
                          </h6>
                        </div>
                      ) : (
                        <div
                          className="premium-amount advance"
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
export default Advance;
