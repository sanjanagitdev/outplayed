import React from 'react';
import Helmet from 'react-helmet';
import { Form } from 'react-bootstrap';
import Layout from '../layout/layout';

const AdvanceListing = () => {
  return (
    <>
      <Helmet>
        <body className="premium-main-page" />
      </Helmet>
      <Layout header={true} footer={true}>
        <div className="premium-listing-page advance-listing-page">
          <div className="">
            <div className="unique-premium unique-advance">
              <h6>Unique Experience</h6>
            </div>
            <div className="premium-list">
              <Form.Group>
                <Form.Check
                  required
                  label="Priority in search for matchmaking"
                />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  required
                  label="NEW LIMITED LEVELS IN THE BATTLE PASS,
EXCLUSIVE MEDALS AND DEFINED SLOTS"
                />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  required
                  label="ADVANCED EXPERIENCE: EmBLEM ADVANCED, ACCESS
                  TO EXCLUSIVE TOURNAMENTS AND EXTRA EXPERIENCE"
                />
              </Form.Group>
            </div>
            <div className="unique-premium unique-advance">
              <h6>Advance Hubs/ Matchmaking</h6>
            </div>
            <div className="premium-list">
              <Form.Group>
                <Form.Check
                  required
                  label="PRIORITY OF BEING CAPTAIN AGAINST NON-PREMIUM USERS"
                />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  required
                  label="PRIORITY IN FINDING A MATCH IN MATCHMAKING"
                />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  required
                  label="PLAY IN TOURNAMENTS / LADDER ADVANCED"
                />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  required
                  label="Play in tournaments/ Ladder Premium"
                />
              </Form.Group>
              <Form.Group>
                <Form.Check required label="Exclusive Awards" />
              </Form.Group>
            </div>
          </div>

          <div className="">
            <div className="unique-premium unique-advance">
              <h6>Advance Option</h6>
            </div>
            <div className="premium-list">
              <Form.Group>
                <Form.Check required label="Priority Support" />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  required
                  label="NAME CHANGE 1 TIME EVERY 3 MONTHS"
                />
              </Form.Group>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
export default AdvanceListing;
