import React from "react";
import { Form, Button } from 'react-bootstrap';
const SupportForm = ({ handleChange, supportState: { subject, description }, imageSelect, CreateTicket, errors, previewImage }) => {
    return <div className="support-form">
        <Form onSubmit={CreateTicket}>
            <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Subject</Form.Label>
                <Form.Control type="text" placeholder="Subject" name="subject" value={subject} onChange={handleChange} />
                {errors.subject && <Form.Text className="text-danger">
                    {errors.subject}
                </Form.Text>}
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={5} onChange={handleChange} name='description' value={description} />
                {errors.description && <Form.Text className="text-danger">
                    {errors.description}
                </Form.Text>}
            </Form.Group>
            <Form.Group>
                {previewImage && <img src={previewImage} className={'suppor-image-data'} alt="image-preview" />}
                <Form.Label for="support-upload" className="support-image">Support image upload</Form.Label>
                <Form.File hidden id="support-upload" onChange={imageSelect} />
                {errors.image && <Form.Text className="text-danger">
                    {errors.image}
                </Form.Text>}
            </Form.Group>
            <div className="support-btn">
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </div>
        </Form>
    </div>
}
export default SupportForm;