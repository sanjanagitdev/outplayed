import React, { useEffect, useState } from "react";
import AdminWrapper from "../adminwrapper/wrapper";
import { Table, Button, Dropdown, Form } from 'react-bootstrap';
import { adminInstance } from '../../../config/axios';
import { Notification } from '../../../function';
import SupportView from "./popup";

const AllTickets = () => {
    const [AllTickets, setAllTickets] = useState([]);
    const [show, setShow] = useState(false);
    const [ticketObject, setTicketObject] = useState({});
    const [errors, setErrors] = useState({});
    const [answer, setAnswer] = useState('');
    const [AllTicketsCopy, setAllTicketsCopy] = useState({});
    const [category, setCategory] = useState('Select filter');
    const [categoryList, setCategoryList] = useState([{ type: 'all', key: 'all' }, { type: 'open', key: "status" }, { type: 'close', key: 'status' }, { type: 'answered', key: "replies" }]);

    useEffect(() => {
        //Use Effect function for fetch all data;
        ticketsList();
    }, []);

    const ticketsList = async () => {
        const response = await adminInstance().get('/ticketlist');
        const { code, ticketlist } = response.data;
        if (code === 200) {
            setAllTickets(ticketlist);
            setAllTicketsCopy(ticketlist);
        }
    }

    const closeTicket = async id => {
        const response = await adminInstance().put(`/closeticket/${id}`);
        const { code, msg } = response.data;
        if (code === 200) {
            Notification('success', msg);
            setShow(false);
            ticketsList();
        } else {
            Notification('danger', msg);
        }
    };

    const handleClose = () => {
        setShow(!show)
    }

    const setOpen = (i) => {
        const selected = [...AllTickets][i];
        setTicketObject(selected);
        setShow(true)
    }

    const PostAnswer = async (tk_id) => {
        try {
            if (!answer.trim()) {
                setErrors({ answer: 'Answer required' })
                return;
            }
            const response = await adminInstance().post("/postAnswer", { answer, tk_id });
            const { data: { code, msg } } = response;
            if (code === 200) {
                Notification('success', msg);
                setShow(false);
                ticketsList();
            }
        } catch (error) {
            return error
        }
    }
    const searchCategory = (value, key, from) => {
        try {
            let filteredData = [];
            if (key !== 'replies' && key !== "all") {
                const exp = new RegExp(value.toLowerCase());
                filteredData = AllTicketsCopy.filter(item =>
                    exp.test(item[key].toLowerCase())
                );
            } else if (key === 'replies') {
                filteredData = AllTicketsCopy.filter(item =>
                    item[key] && item[key].length > 0
                );
            } else if (key === 'all') {
                filteredData = AllTicketsCopy;
            }
            if (from !== 'text') {
                setCategory(value)
            }
            setAllTickets(filteredData);
        } catch (e) {
            return e;
        }
    };
    return (
        <AdminWrapper>
            <div className="user-list">
                <div className="container">
                    <h2 className="admin-title">All Tickets</h2>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="all-ticket-dropdown">
                                <Form.Group controlId="formBasicloginone">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                            {category}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {categoryList && categoryList.map((el, i) => {
                                                return (
                                                    <Dropdown.Item key={i} active={el.active} onClick={() => searchCategory(el.type, el.key, 'nottext')}>{el.type}</Dropdown.Item>
                                                )
                                            })}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                            </div>

                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="formBasicloginone">
                                <Form.Control type="text" placeholder="Search by subject"
                                    className="mr-sm-2" onChange={(e) => searchCategory(e.target.value, 'subject', 'text')} />
                            </Form.Group>
                        </div>
                        <div className="col-md-12">
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>S.N</th>
                                        <th>Subject</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Posted by</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {AllTickets && AllTickets.map((el, i) => {
                                        return <TicketsDataList element={el} index={i} setOpen={setOpen} />
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
                {show && <SupportView show={show} handleClose={handleClose} handleChange={setAnswer} ticketObject={ticketObject} errors={errors} closeTicket={closeTicket} PostAnswer={PostAnswer} />}
            </div>
        </AdminWrapper>
    );
};
export default AllTickets;

const TicketsDataList = ({ element, index, setOpen }) => {
    const { subject, status, description, sender: { username } } = element;
    return (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{subject}</td>
            <td>{description.length > 50 ? description.substring(0, 50) : description}</td>
            <td>{status}</td>
            <td>{username}</td>
            <td>
                <div className="action-buttons">
                    <Button className="approve-btn" onClick={() => setOpen(index)}><i class="fa fa-eye" aria-hidden="true"></i></Button>
                </div>
            </td>
        </tr>
    )
}

