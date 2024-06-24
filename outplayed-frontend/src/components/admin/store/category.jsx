import React, { useEffect, useState } from "react";
import AdminWrapper from "../adminwrapper/wrapper";
import { Table, Button, Form } from 'react-bootstrap';
import history from "../../../config/history";
import { adminInstance } from '../../../config/axios';
import { Notification } from '../../../function';

const CategoryStore = () => {
    const [allcategory, setStore] = useState([]);
    const [, setcategoryCopy] = useState([]);
    useEffect(() => {
        StoreListData();
    }, [])
    const StoreListData = async () => {
        const response = await adminInstance().get('/categoryslist');
        const { code, allcategorys } = response.data;
      
        if (code === 200) {
            setStore(allcategorys);
            setcategoryCopy(allcategorys);
        }
    }
    const Deletecategory = async (_id) => {
        const response = await adminInstance().delete(`/deleteCategory/${_id}`);
        const { code, msg } = response.data;
        if (code === 200) {
            Notification('success', msg);
            setStore((oldArray) => oldArray.filter((el) => el._id !== _id));
            setcategoryCopy((oldArray) => oldArray.filter((el) => el._id !== _id));
        } else {
            Notification('danger', msg);
        }
    }
    return (
        <AdminWrapper>
            <div className="user-list">
                <div className="container">
                    <h2 className="admin-title">All category</h2>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="admin-search">
                                <Form inline>
                                    <Button onClick={() => history.push("/admin/store/addcategory")}>Add category</Button>
                                </Form>
                            </div>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allcategory && allcategory.map((el, i) => {
                                        return <CategoryList element={el} index={i} Deletecategory={Deletecategory} />
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
export default CategoryStore;

const CategoryList = ({ element, index, Deletecategory }) => {
    const { name, _id } = element;
    return (
        <tr key={index}>
            <td>{name.substring(0, 25) + "..."}</td>
            <td>
                <div className="action-buttons">
                    <Button className="block-btn" onClick={() => {
                        if (
                            window.confirm(
                                'Are you sure to delete this category?'
                            )
                        ) {
                            Deletecategory(_id);
                        }
                    }}>Delete</Button>
                    <Button onClick={() => history.push(`/admin/store/addcategory/?type=edit&id=${_id}`)} className="approve-btn">Views & edit</Button>
                </div>
            </td>
        </tr>
    )
}

