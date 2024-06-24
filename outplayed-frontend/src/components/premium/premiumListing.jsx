import React from 'react';
import Helmet from 'react-helmet';
import { Form } from 'react-bootstrap';
import Layout from '../layout/layout';

const PremiumListing = () => {
  return (
    <>
      <Helmet>
        <body className="premium-main-page" />
      </Helmet>
      <Layout header={true} footer={true}>
        <div className="premium-listing-page">
          <div className="">
            <div className="unique-premium">
              <h6>Unique Experience</h6>
            </div>
            <div className="premium-list">
              <Form.Group>
                <Form.Check required label="Clear Gathers" />
              </Form.Group>
              <Form.Group>
                <Form.Check required label="Search Priority in Matchmaking" />
              </Form.Group>
              <Form.Group>
                <Form.Check required label="Highlighted Streams" />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  required
                  label="NEW LEVELS IN THE BATTLE PASS, EXCLUSIVE MEDALS AND UNDEFINED SLOTS"
                />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  required
                  label="GOLDEN EXPERIENCE: PREMIUM EMBLEM, UNLIMITED ACCESS TO PAY TOURNAMENTS, CHANGE YOUR NICK
1 TIME A MONTH AND GET MORE EXPERIENCE BY LEVELING UP."
                />
              </Form.Group>
            </div>
            <div className="unique-premium">
              <h6>Premium Hubs/ Matchmaking</h6>
            </div>
            <div className="premium-list">
              <Form.Group>
                <Form.Check required label="Play on Premium Hubs" />
              </Form.Group>
              <Form.Group>
                <Form.Check required label="Priority in finding a game" />
              </Form.Group>
              <Form.Group>
                <Form.Check required label="Priority to be Captain" />
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
            <div className="unique-premium">
              <h6>Advance Statistics</h6>
            </div>
            <div className="premium-list">
              <Form.Group>
                <Form.Check
                  required
                  label="NEW, MORE COMPLETE PERSONAL STATISTICS"
                />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  required
                  label="Compare with the players you want"
                />
              </Form.Group>
            </div>
            <div className="unique-premium">
              <h6>
                <span>Advance</span> Included
              </h6>
            </div>
            <div className="premium-list">
              <Form.Group>
                <Form.Check
                  required
                  label="Participates in advance tournaments / Ladders"
                />
              </Form.Group>
              <Form.Group>
                <Form.Check required label="Priority Support" />
              </Form.Group>
              <Form.Group>
                <Form.Check required label="Exclusive levels and medals" />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  required
                  label="Greater number of slots for the medals/ emblems"
                />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  required
                  label="ADVANCED EXPERIENCE: ADVANCED EMBLEM, ACCESS TO EXCLUSIVE TOURNAMENTS
AND EXTRA EXPERIENCE TO LEVEL UP"
                />
              </Form.Group>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
export default PremiumListing;
