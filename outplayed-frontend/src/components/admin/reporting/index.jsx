import React, { useEffect, useState } from "react";
import AdminWrapper from "../adminwrapper/wrapper";
import { Table, Button, Modal } from 'react-bootstrap';
import { adminInstance } from '../../../config/axios';


const AllReports = () => {
    const [reports, setReports] = useState([]);
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState({});


    useEffect(() => {
        //Use Effect function for fetch all data;
        reportsList();
    }, []);

    const reportsList = async () => {
        const response = await adminInstance().get('/allreports');
        const { code, allreportsData } = response.data;
        if (code === 200) {
            setReports(allreportsData);
        }
    }

    const handleClose = (type, index) => {
        if (type === 'open') {
            const oldState = [...reports][index]
            setSelected(oldState);
        }
        setShow(!show)
    }


    return (
        <AdminWrapper>
            <div className="user-list">
                <div className="container">
                    <h2 className="admin-title">All Reports</h2>
                    <div className="row">

                        <div className="col-md-12">
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>S.N</th>
                                        <th>Reported by</th>
                                        <th>Reported to</th>
                                        <th>Category</th>
                                        <th>Description</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports && reports.map((el, i) => {
                                        return <ReportList element={el} index={i} setOpen={handleClose} />
                                    })}
                                </tbody>
                            </Table>
                        </div>
                        {show && <SupportView show={show} handleClose={handleClose} selected={selected} />}
                    </div>
                </div>

            </div>
        </AdminWrapper>
    );
};
export default AllReports;

const ReportList = ({ element, index, setOpen }) => {
    const { description, category, reportedBy: { username: user1 }, reportedTo: { username: user2 } } = element;
    return (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{user1}</td>
            <td>{user2}</td>
            <td>{category}</td>
            <td>{description.length > 50 ? description.substring(0, 50) + '...' : description}</td>
            <td>
                <div className="action-buttons">
                    <Button className="approve-btn" onClick={() => setOpen("open", index)}><i class="fa fa-eye" aria-hidden="true"></i></Button>
                </div>
            </td>
        </tr>
    )
}

const SupportView = ({ show, handleClose, selected: { description, createdAt, category } }) => {

    return (
        <Modal show={show} onHide={() => handleClose('close')} className="accountmodal supportmodal">
            <Modal.Header closeButton>
                <div />
            </Modal.Header>
            <Modal.Body>
                <h6>{category}</h6>
                <div className="row">
                    <div className="col-md-12">
                        <p>Reported At:- <span>{new Date(createdAt).toLocaleString()}</span></p>
                        <p className="support-description">
                            {description}
                        </p>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
