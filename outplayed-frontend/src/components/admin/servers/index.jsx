import React, { useState, useEffect } from "react";
import { Form, Button } from 'react-bootstrap';
import { adminInstance } from '../../../config/axios';
import { Notification, queryString } from '../../../function';
import AdminWrapper from "../adminwrapper/wrapper";
import history from '../../../config/history';

let initialState = {
    ip: "",
    port: "",
    rconpassword: "",
    sshuser: "",
    sshpassword: "",
    servertype: ""
}

const AddServer = () => {
    const [serverData, setServerData] = useState(initialState);
    const [check, setCheck] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const { type, id } = queryString();
        if (type && id) {
            setCheck(true);
            GetServerData();
        }
    }, []);

    const GetServerData = async () => {
        try {
            const { type, id } = queryString();
            if (type && id) {
                const response = await adminInstance().get(`/serverget/${id}`);
                const { code, serverdata } = response.data;
                if (code === 200) {
                    setServerData(serverdata);
                }
            }

        } catch (error) {
            return error;
        }

    }
    // const delServer = async id => {
    //     const payload = { id: id };
    //     const response = await adminInstance().post("/delserver", payload);
    //     const { code, msg } = response.data;
    //     if (code === 200) {
    //         Notification('success', msg);
    //     } else {
    //         Notification('danger', msg);
    //     }
    // };

    const onChange = e => {
        setServerData({ ...serverData, [e.target.name]: e.target.value });
    };

    const addServer = async (e) => {
        e.preventDefault()
        const response = await adminInstance().post("/addserver", serverData);
        const { code, msg } = response.data;
        if (code === 200) {
            Notification('success', msg);
            history.push('/admin/serverlist');
        } else {
            Notification('danger', msg);
        }
    };

    const updateServer = async (e) => {
        e.preventDefault()
        const { type, id } = queryString();
        if (type && id) {
            const response = await adminInstance().patch(`/updateserver/${id}`, serverData);
            const { code, msg } = response.data;
            if (code === 200) {
                Notification('success', msg);
                history.push('/admin/serverslist');
            } else {
                Notification('danger', msg);
            }
        }
    };

    const { ip, port, sshpassword, sshuser, rconpassword, servertype } = serverData ? serverData : {};

    return (
        <AdminWrapper>
            <div className="user-list">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>{check ? 'Update' : 'Add'} Server</h2>
                            <Form onSubmit={check ? updateServer : addServer}>
                                <Form.Group controlId="formBasicloginone">
                                    <Form.Label>Server ip</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter server ip"
                                        name="ip"
                                        autoComplete="off"
                                        value={ip}
                                        onChange={onChange}
                                    />
                                    {errors.ip && <span style={{ color: 'red' }}>{errors.ip}</span>}
                                </Form.Group>
                                <Form.Group controlId="formBasicloginone">
                                    <Form.Label>Server port</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter server port"
                                        name="port"
                                        autoComplete="off"
                                        value={port}
                                        onChange={onChange}
                                    />
                                    {errors.port && <span style={{ color: 'red' }}>{errors.port}</span>}
                                </Form.Group>
                                <Form.Group controlId="formBasicloginone">
                                    <Form.Label>Server rcon password</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter server rconpassword"
                                        name="rconpassword"
                                        autoComplete="off"
                                        value={rconpassword}
                                        onChange={onChange}
                                    />
                                    {errors.rconpassword && <span style={{ color: 'red' }}>{errors.rconpassword}</span>}
                                </Form.Group>
                                <Form.Group controlId="formBasicloginone">
                                    <Form.Label>Server sshuser</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter server sshuser"
                                        name="sshuser"
                                        autoComplete="off"
                                        value={sshuser}
                                        onChange={onChange}
                                    />
                                    {errors.sshuser && <span style={{ color: 'red' }}>{errors.sshuser}</span>}
                                </Form.Group>
                                <Form.Group controlId="formBasicloginone">
                                    <Form.Label>Server sshpassword</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter server sshpassword"
                                        name="sshpassword"
                                        autoComplete="off"
                                        value={sshpassword}
                                        onChange={onChange}
                                    />
                                    {errors.sshpassword && <span style={{ color: 'red' }}>{errors.sshpassword}</span>}
                                </Form.Group>
                                <Form.Group controlId="formBasicloginone">
                                    <Form.Label>Server type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter server servertype"
                                        name="servertype"
                                        autoComplete="off"
                                        value={servertype}
                                        onChange={onChange}
                                    />
                                    {errors.servertype && <span style={{ color: 'red' }}>{errors.servertype}</span>}
                                </Form.Group>
                                <div className="">
                                    <div className="login-button">
                                        {check ? <Button type="submit" className="l-btn" >
                                            Update server
                                    </Button> : <Button type="submit" className="l-btn" >
                                                ADD server
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
export default AddServer;