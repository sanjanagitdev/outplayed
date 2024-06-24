import React from 'react';
import { Modal, Button, Form } from "react-bootstrap";


const SupportView = ({ show, handleClose, ticketObject: { subject, description, createdAt, _id, status, attachment }, handleChange, errors, closeTicket, PostAnswer, }) => {

    return (
        <Modal show={show} onHide={() => handleClose('close')} className="accountmodal supportmodal">
            <Modal.Header closeButton>
                <div />
            </Modal.Header>
            <Modal.Body>
                <h6>{subject}</h6>
                <div className="row">
                    <div className="col-md-12">
                        <p>Posted At:- <span>{new Date(createdAt).toLocaleString()}</span></p>
                        <p className="support-description">
                            {description}
                        </p>
                        {attachment && <div className="attachment-data">
                            {attachment && attachment.length > 0 && attachment.map((el, i) => {
                                return <img src={el} alt="attachment" key={i} className='admin-attachment-isseu' />
                            })}
                        </div>}

                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Answer</Form.Label>
                            <Form.Control as="textarea" rows={5} placeholder="Type your answer" name="answer" onChange={(e) => handleChange(e.target.value)} />
                            {errors.answer && <Form.Text className="text-danger">
                                {errors.answer}
                            </Form.Text>}
                        </Form.Group>
                        <div className="support-ticket">
                            <Button variant="success" onClick={() => PostAnswer(_id)}>
                                Post answer
                           </Button>
                            <Button variant={status === 'open' ? 'danger' : 'success'} onClick={() => closeTicket(_id)}>
                                {status === 'open' ? 'close' : 'open'} ticket
                           </Button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
export default SupportView;