import React, { useEffect, useState } from "react";
import AdminWrapper from "../adminwrapper/wrapper";
import { Table, Button, Form } from 'react-bootstrap';
import history from "../../../config/history";
import { adminInstance } from '../../../config/axios';
import { Notification } from '../../../function';

const ServerList = () => {
    const [allServer, setAllServers] = useState([]);
    const [allServerCopy, setAllServersCopy] = useState([]);
    const [search, setSearch] = useState('');
    useEffect(() => {
        serverList();
    }, [])
    const serverList = async () => {
        const response = await adminInstance().get('/serverlist');
        const { code, serverlist } = response.data;
        if (code === 200) {
            setAllServers(serverlist);
            setAllServersCopy(serverlist);
        }
    }
    const delServer = async id => {
        const payload = { id: id };
        const response = await adminInstance().delete(`/delserver/${id}`, payload);
        const { code, msg } = response.data;
        if (code === 200) {
            Notification('success', msg);
        } else {
            Notification('danger', msg);
        }
    };

    return (
        <AdminWrapper>
            <div className="user-list">
                <div className="container">
                    <h2 className="admin-title">Server List</h2>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="admin-search">
                                <Form inline>
                                    <Button onClick={() => history.push("/admin/addserver")}>Add Server</Button>
                                </Form>
                            </div>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>S.N</th>
                                        <th>IP</th>
                                        <th>PORT</th>
                                        <th>SSH USER</th>
                                        <th>SERVER TYPE</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allServer && allServer.map((el, i) => {
                                        return <ServerLists element={el} index={i} delServer={delServer} />
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminWrapper>
    );
};
export default ServerList;

const ServerLists = ({ element, index, delServer }) => {
    const { ip, port, sshuser, servertype, _id } = element;
    return (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{ip}</td>
            <td>{port}</td>
            <td>{sshuser}</td>
            <td>{servertype}</td>
            <td>
                <div className="action-buttons">
                    <Button className="block-btn" onClick={() => {
                        if (
                            window.confirm(
                                'Are you sure to delete this server ?'
                            )
                        ) {
                            delServer(_id);
                        }
                    }}>Delete</Button>
                    <Button onClick={() => history.push(`/admin/addserver/?type=edit&id=${_id}`)} className="approve-btn">Views & edit</Button>
                </div>
            </td>
        </tr>
    )
}

