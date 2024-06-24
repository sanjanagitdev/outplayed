import React from 'react';
import { Form, Button } from 'react-bootstrap';
import PopupWrapper from '../popups/popupwrapper';
import './sectionincident.css';
import arrow from '../../assets/hubs/arrow.png';

const SectionIncidents = ({
  incident, showIncident, handleChange,
  supportState: { subject, description },
  imageSelect,
  CreateTicket,
  errors,
  previewImage }) => {
  return (
    <PopupWrapper
      show={incident}
      handleClose={showIncident}
      heading={'Incident Form'}
      defaultClass={'outlayed-popup team-popup incident-popup'}
    >
      <div className="incident-form ">
        <Form onSubmit={CreateTicket}>
          <Form.Group controlId="formBasicTitle">
            <Form.Control type="text" placeholder="Title" name="subject" value={subject} onChange={handleChange} />
            {errors.subject && <Form.Text className="text-danger">
              {errors.subject}
            </Form.Text>}
          </Form.Group>
          <Form.Group
            controlId="exampleForm.ControlSelect1"
            className="custom-select-box"
          >
            <Form.Control as="select" name='category' onChange={handleChange}>
              <option >Select category</option>
              <option value="Technical support">Technical support</option>
              <option value="Account">Account</option>
              <option value="Hubs">Hubs</option>
              <option value="Matchmaking">Matchmaking</option>
              <option value="Tournament">Tournament</option>
              <option value="Ladders">Ladders</option>
              <option value="Other">Other</option>
            </Form.Control>
            <img src={arrow} alt="arrow" />
            {errors.category && <Form.Text className="text-danger">
              {errors.category}
            </Form.Text>}
          </Form.Group>
          <Form.Group controlId="formBasicIssue">
            <Form.Control as="textarea" rows={1} onChange={handleChange} placeholder="INCIDENT ISSUE" name='description' value={description} />
            {errors.description && <Form.Text className="text-danger">
              {errors.description}
            </Form.Text>}
          </Form.Group>
          <Form.Group controlId="formBasicFile">
            <div className="incident-file-upload">
              <Form.Label>
                <i className="fa fa-paperclip" />
              </Form.Label>
              <Form.Control
                id="exampleFormControlFile1"
                type="file"
                className="form-control-file"
                multiple onChange={(e) => imageSelect(e.target.files)}
              />
              {errors.image && <Form.Text className="text-danger">
                {errors.image}
              </Form.Text>}
            </div>
            {previewImage && previewImage.map((el, i) => {
              return <div>
                <div className="upload-img-name">
                  <span className="number">{i + 1}.</span>
                  <span>{el.name}</span>
                </div>
                <div className="placeholder-img">
                  <img src={el.url} alt="img-url" />
                </div>
              </div>
            })}
          </Form.Group>
          <div className="incident-popup-btn">
            <Button className="send-btn" type='submit'>Send</Button>
            <Button classNAme="cancle-btn">Cancel</Button>
          </div>
        </Form>
      </div>
    </PopupWrapper>
  );
};
export default SectionIncidents;
