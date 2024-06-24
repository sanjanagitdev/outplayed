import React, { useEffect, useState } from "react";
import AdminWrapper from "../adminwrapper/wrapper";
import { Table, Button, Form, FormControl } from 'react-bootstrap';
import history from "../../../config/history";
import { adminInstance } from '../../../config/axios';
import { Notification } from '../../../function';

const NormalHubList = () => {
    const [allnormalhubs, setNormalHubs] = useState([]);
    const [allnormalhubsCopy, setNormalHubsCopy] = useState([]);
    const [search, setSearch] = useState('');
    useEffect(() => {
        NormalListData();
    }, [])
    const NormalListData = async () => {
        const response = await adminInstance().get('/normalhubslist');
        const { code, allnormalhubs } = response.data;
        if (code === 200) {
            setNormalHubs(allnormalhubs);
            setNormalHubsCopy(allnormalhubs);
        }
    }
    const HandleDeleteNormalHub = async (_id) => {
        const response = await adminInstance().delete(`/deletehubyid/${_id}`);
        const { code, msg } = response.data;
        if (code === 200) {
            Notification('success', msg);
            setNormalHubs((oldArray) => oldArray.filter((el) => el._id !== _id));
            setNormalHubsCopy((oldArray) => oldArray.filter((el) => el._id !== _id));
        } else {
            Notification('danger', msg);
        }
    }
    const searchCategory = e => {
        try {
            let { value } = e.target;
            const exp = new RegExp(value.toLowerCase());
            const filteredData = allnormalhubsCopy.filter(item =>
                exp.test(item.name.toLowerCase())
            );
            setNormalHubs(filteredData);
            setSearch(value);
        } catch (e) {
            return 0;
        }
    };
    return (
        <AdminWrapper>
            <div className="user-list">
                <div className="container">
                    <h2 className="admin-title">Normal Hubs List</h2>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="admin-search">
                                <Form inline>
                                    <FormControl type="text" placeholder="Search normal hub"
                                        value={search} className="mr-sm-2" onChange={(e) => searchCategory(e)} />
                                    <Button onClick={() => history.push("/admin/addhubs")}>Add Normal hubs</Button>
                                </Form>
                            </div>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>S.N</th>
                                        <th>NAME</th>
                                        <th>PRESTIGE</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allnormalhubs && allnormalhubs.map((el, i) => {
                                        return <NewsList element={el} index={i} HandleDeleteNormalHub={HandleDeleteNormalHub} />
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
export default NormalHubList;

const NewsList = ({ element, index, HandleDeleteNormalHub }) => {
    const { name, prestige, _id } = element;
    return (
        <tr key={index}>
            {<td>{index + 1}</td>}
            <td>{name}</td>
            <td>{prestige}</td>
            <td>
                <div className="action-buttons">
                    <Button className="block-btn" onClick={() => {
                        if (
                            window.confirm(
                                'Are you sure to delete this normal hub?'
                            )
                        ) {
                            HandleDeleteNormalHub(_id);
                        }
                    }}>Delete</Button>
                    <Button onClick={() => history.push(`/admin/addhubs/?type=edit&id=${_id}`)} className="approve-btn">Views & edit</Button>
                </div>
            </td>
        </tr>
    )
}

