import React, { useState, useContext } from 'react';
import { Tab, Row, Nav, Col, Table } from "react-bootstrap";
import Layout from '../layout/layout';
import UserContext from "../../context/context";
//import Supportleft from './support-left';
import SupportForm from './supportform';
import './support.css';
import { userInstance } from '../../config/axios';
import { SuportValidation, Notification } from '../../function';
import Supportlisting from './support-listing';
import Loader from "../loader/loader";

const Support = () => {
  const { userDetails: { postedtickets }, userDetails, setUserDetails } = useContext(UserContext);
  const postedTickets = postedtickets ? postedtickets : [];
  const initialState = {
    subject: '',
    description: '',
  };

  const [supportState, setSupportState] = useState(initialState);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupportState({ ...supportState, [name]: value });
  };

  const imageSelect = (e) => {
    setImage(e.target.files[0]);
    setPreviewImage(URL.createObjectURL(e.target.files[0]))
  };

  const CreateTicket = async (e) => {
    try {
      e.preventDefault();
      const { isValid, errors } = SuportValidation(supportState, image);
      if (!isValid) {
        setErrors(errors);
        return;
      }
      const data = new FormData();
      data.append("file", image);
      setLoading(true);
      const response = await userInstance().post("/postticket", data, {
        params: supportState
      });
      const { data: { code, msg, supportTicket } } = response;
      if (code === 200) {
        Notification('success', msg);
        let { postedtickets } = userDetails;
        postedtickets = postedtickets ? postedtickets : [];
        postedtickets.unshift(supportTicket)
        setUserDetails({ ...userDetails, postedtickets: postedtickets });
        setSupportState(initialState);
        setLoading(false);
      } else {
        setLoading(false);
        Notification('danger', msg);
      }
    } catch (error) {
      return error;
    }
  };

  const ClosedTickets = (postedTicketsData) => {
    return postedTicketsData.filter(el => el.status === 'close');
  }
  const AnsweredTickets = (postedTicketsData) => {
    return postedTicketsData.filter(el => el.replies && el.replies.length > 0);
  }

  return (
    <Layout header={true} footer={true}>
      {loading && <Loader />}
      <div className="support-main-page">
        <div className="main-wrapper">
          <Tab.Container id="left-tabs-example" defaultActiveKey="0">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="0">Create ticket</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="1">All ({postedTickets.length})</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="3">Answered ({AnsweredTickets(postedTickets).length})</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="4">Closed ({ClosedTickets(postedTickets).length})</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="0">
                <div className="middle-wrapper">
                  <div className="support-header">
                    <h6>Support</h6>
                  </div>
                  <div className="support-page">
                    <SupportForm
                      handleChange={handleChange}
                      supportState={supportState}
                      imageSelect={imageSelect}
                      CreateTicket={CreateTicket}
                      errors={errors}
                      previewImage={previewImage}
                    />
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="1">
                <Supportlisting ticketsList={postedTickets} />
              </Tab.Pane>

              <Tab.Pane eventKey="3">
                <Supportlisting ticketsList={AnsweredTickets(postedTickets)} />
              </Tab.Pane>
              <Tab.Pane eventKey="4">
                <Supportlisting ticketsList={ClosedTickets(postedTickets)} />
              </Tab.Pane>
            </Tab.Content>

          </Tab.Container>
        </div>
      </div>
    </Layout>
  );
};
export default Support;

