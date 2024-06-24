import React, { useEffect, useState } from "react";
import AdminWrapper from "../adminwrapper/wrapper";
import { Table, Button, Form } from 'react-bootstrap';
import history from "../../../config/history";
import { adminInstance } from '../../../config/axios';
import { Notification } from '../../../function';

const MapsList = () => {
    const [allMpas, setAllMaps] = useState([]);
    const [allMpasCopy, setAllMpasCopy] = useState([]);
    const [search, setSearch] = useState('');
    useEffect(() => {
        NormalListData();
    }, [])
    const NormalListData = async () => {
        const response = await adminInstance().get('/allmaps');
        const { code, maps } = response.data;
        if (code === 200) {
            setAllMaps(maps);
            setAllMpasCopy(maps);
        }
    }
    const handleDeleteMap = async (_id) => {
        const response = await adminInstance().delete(`/deletemap/${_id}`);
        const { code, msg } = response.data;
        if (code === 200) {
            Notification('success', msg);
            setAllMaps((oldArray) => oldArray.filter((el) => el._id !== _id));
            setAllMpasCopy((oldArray) => oldArray.filter((el) => el._id !== _id));
        } else {
            Notification('danger', msg);
        }
    }

    return (
        <AdminWrapper>
            <div className="user-list">
                <div className="container">
                    <h2 className="admin-title">Maps List</h2>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="admin-search">
                                <Form inline>
                                    <Button onClick={() => history.push("/admin/addmaps")}>Add maps</Button>
                                </Form>
                            </div>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>S.N</th>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allMpas && allMpas.map((el, i) => {
                                        return <MapList element={el} index={i} handleDeleteMap={handleDeleteMap} />
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
export default MapsList;

const MapList = ({ element, index, handleDeleteMap }) => {
    const { title, _id, imgurl, maptype } = element;
    return (
        <tr key={index}>
            <td>{index + 1}</td>
            <td><img src={imgurl} className="img-size" /></td>
            <td>{title}</td>
            <td>{maptype}</td>
            <td>
                <div className="action-buttons">
                    <Button className="block-btn" onClick={() => {
                        if (
                            window.confirm(
                                'Are you sure to delete this map ?'
                            )
                        ) {
                            handleDeleteMap(_id);
                        }
                    }}>Delete</Button>
                    <Button onClick={() => history.push(`/admin/addmaps/?type=edit&id=${_id}`)} className="approve-btn">Views & edit</Button>
                </div>
            </td>
        </tr>
    )
}

