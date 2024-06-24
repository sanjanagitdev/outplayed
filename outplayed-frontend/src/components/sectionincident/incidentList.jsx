import React, { useContext } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import PopupWrapper from '../popups/popupwrapper';
import UserContext from "../../context/context";
import './sectionincident.css';
// import arrow from '../../assets/hubs/arrow.png';

const IncidentList = ({ incidentList, showIncidentList, showIncident }) => {
  const { userDetails } = useContext(UserContext);
  const { postedtickets, answeredTickets, closedTickets } = userDetails;
  return (
    <PopupWrapper
      show={incidentList}
      handleClose={showIncidentList}
      heading={'Incidents'}
      defaultClass={' incident-list-popup'}
    >
      <div className="listing-popup">
        <div className="closing-btn" onClick={showIncidentList}>
          <i class="fa fa-times-circle-o" aria-hidden="true"></i>
        </div>

        <h1>Incidents</h1>
        <Tabs defaultActiveKey="All">
          <Tab eventKey="All" title="All">
            <IncidentItemData itemsData={postedtickets} />
          </Tab>
          <Tab eventKey="New" title="New">
            <IncidentItemData itemsData={postedtickets} />
          </Tab>
          <Tab eventKey="ANSWERS" title="ANSWERS">
            <IncidentItemData itemsData={answeredTickets} />
          </Tab>
          <Tab eventKey="CLOSED" title="CLOSED">
            <IncidentItemData itemsData={closedTickets} />
          </Tab>
        </Tabs>
        <div className="incident-btn">
          <button onClick={showIncident} className="add-incident">
            + Add Incident
              </button>
        </div>
      </div>
    </PopupWrapper>
  );
};
export default IncidentList;


const IncidentItem = ({ element, index }) => {
  const { category, status, subject, replies } = element;
  return <div className="incident-body" key={index}>
    <div className="number">
      {index + 1}
    </div>
    <div className="Category">{category}</div>
    <div className="Category">{subject}</div>
    <div className="State">{status}</div>
    <div className="answer">{replies[0] ? replies[0].answer : 'Not answered'}</div>
  </div>
}

const IncidentHeader = () => {
  return <div className="incident-header">
    <div className="number">Sr No.</div>
    <div className="Category">Title</div>
    <div className="Category">Category</div>
    <div className="State">State</div>
    <div className="answer">Answer</div>
  </div>
}


const IncidentItemData = ({ itemsData }) => {
  return <div className="incident-list">
    <div className="incident-listing">
      <div className="incident-table">
        <IncidentHeader />
        {itemsData && itemsData.length > 0 ? itemsData.map((el, i) => {
          return <IncidentItem element={el} index={i} />
        }) : <div className="not-found-inci"><h3>No Data Found</h3></div>}
      </div>
    </div>
  </div>
}