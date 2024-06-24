import React, { useState, useEffect } from "react";
import { Form, Button, Dropdown } from 'react-bootstrap';
import { adminInstance } from '../../../config/axios';
import { Notification, queryString, validateNormalHub } from '../../../function';
import AdminWrapper from "../adminwrapper/wrapper";
import history from '../../../config/history';

const NormalHub = () => {
    const [name, setName] = useState("");
    const [prestige, setPrestige] = useState("Please select prestige");
    const [check, setCheck] = useState(false);
    const [errors, setErrors] = useState({});

    const [prestigeList, setPristigeList] = useState([{ type: 'Prestige 1', active: false }, { type: 'Prestige 2', active: false }, { type: 'Prestige 3', active: false }, { type: 'Prestige 4', active: false }, { type: 'Prestige 5', active: false }, { type: 'Prestige 6', active: false }, { type: 'Prestige 7', active: false }, { type: 'Prestige 8', active: false }, { type: 'Prestige 9', active: false }, { type: 'Prestige 10', active: false }]);
    const addNormalHub = async e => {
        e.preventDefault();
        const { isValid, errors } = validateNormalHub({ name, prestige });
        if (!isValid) {
            setErrors(errors)
            return;
        }
        const response = await adminInstance().post('/createnormalhub', { name, prestige });
        const { data: { code, msg } } = response;
        if (code === 200) {
            Notification('success', msg);
            history.push('/admin/hubslist');
        } else {
            Notification('danger', msg);
        }
    };
    useEffect(() => {
        const { type, id } = queryString();
        if (type && id) {
            setCheck(true);
            GetNormalHubsData();
        }
    }, []);
    const updateNormalHub = async (e) => {
        e.preventDefault();
        const { type, id } = queryString();
        if (type && id) {
            const payload = { hubid: id, name, prestige };
            const { isValid, errors } = validateNormalHub(payload);
            if (!isValid) {
                setErrors(errors)
                return;
            }
            const response = await adminInstance().patch("/updatenormalhub", payload);
            const { data: { code, msg } } = response;
            if (code === 200) {
                Notification('success', msg);
            } else {
                Notification('danger', msg);
            }
        }
    }

    const GetNormalHubsData = async () => {
        const { type, id } = queryString();
        if (type && id) {
            const response = await adminInstance().get(`/normalhubbyid/${id}`);
            const { code, data } = response.data;
            if (code === 200) {
                const { name, prestige } = data;
                setName(name);
                setPrestige(prestige);
                selectPrestigeList(prestige);
            }
        }
    }
    const selectPrestigeList = (type) => {
        const oldState = [...prestigeList];
        oldState.forEach(el => {
            if (el.type === type) {
                setPrestige(type);
                el.active = true;
            } else {
                el.active = false;
            }
        })
        setPristigeList(oldState);
    }
    return (
        <AdminWrapper>
            <div className="user-list">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>{check ? 'Update' : 'Add'} Normal Hub</h2>
                            <Form onSubmit={check ? updateNormalHub : addNormalHub}>
                                <Form.Group controlId="formBasicloginone">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="title"
                                        name="Hub name"
                                        autoComplete="off"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
                                </Form.Group>
                                <Form.Group controlId="formBasicloginone">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                            {prestige}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {prestigeList && prestigeList.map((el, i) => {
                                                return (
                                                    <Dropdown.Item key={i} active={el.active} onClick={() => selectPrestigeList(el.type)}>{el.type}</Dropdown.Item>
                                                )
                                            })}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {errors.prestige && <span style={{ color: 'red' }}>{errors.prestige}</span>}
                                </Form.Group>
                                <div className="">
                                    <div className="login-button">
                                        {check ? <Button type="submit" className="l-btn" >
                                            Update Normal Hub
                                    </Button> : <Button type="submit" className="l-btn" >
                                                ADD Normal Hub
                                    </Button>}
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminWrapper>
    );
};
export default NormalHub;