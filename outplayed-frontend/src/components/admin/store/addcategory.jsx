import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Dropdown } from 'react-bootstrap';
import { adminInstance } from '../../../config/axios';
import { Notification, queryString } from '../../../function';
import AdminWrapper from "../adminwrapper/wrapper";
import history from '../../../config/history';
const AddCategory = () => {
    const [name, setName] = useState("");
    const [check, setCheck] = useState(false);
    const addCategory = async e => {
        e.preventDefault();
                const payload = { name}
                const response = await adminInstance().post("/createcategory",{name:name});                
                const { code, msg } = response.data;
                if (code === 200) {
                    history.push('/admin/store/category');
                    Notification('success', msg);
                }
    };
    useEffect(() => {
        const { type, id } = queryString();
        if (type && id) {
            setCheck(true);
            GetStoreData();
        }
    }, []);
    const updateCategorys = async (e) => {
        e.preventDefault();
        const { type, id } = queryString();
        if (type && id) {
            updateFromBoth(id)
        }

    }
    const updateFromBoth = async (id) => {
        const payload = { name}
        const response = await adminInstance().post("/updateCategory",{name:name,id:id}); 
        const { code, msg } = response.data;
        if (code === 200) {
            history.push('/admin/store/category');
            Notification('success', msg);
        } else {
            Notification('danger', msg);
        }
    }

    const GetStoreData = async () => {
        const { type, id } = queryString();
        if (type && id) {
            const response = await adminInstance().get(`/categorybyid/${id}`);        
            const { code, data } = response.data;
            if (code === 200) {
                const { name} = data;
                setName(name);
            }
        }
    } 
    return (
        <AdminWrapper>
            <div className="user-list">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>{check ? 'Update' : 'Add'} Category</h2>
                            <Form onSubmit={check ? updateCategorys : addCategory}>
                                <Form.Group controlId="formBasicloginone">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="title"
                                        name="name"
                                        autoComplete="off"
                                        value={name}
                                        required={true}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>
                                <div className="">
                                    
                                    <div className="login-button">
                                        {check ? <Button type="submit" className="l-btn" >
                                            Update
                                    </Button> : <Button type="submit" className="l-btn" >
                                                ADD
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
export default AddCategory;
