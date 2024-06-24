import React, { useEffect, useState } from "react";
import AdminWrapper from "../adminwrapper/wrapper";
import { Table, Button, Form } from 'react-bootstrap';
import history from "../../../config/history";
import { adminInstance } from '../../../config/axios';
import { Notification } from '../../../function';

const ProductStore = () => {
    const [allproduct, setStore] = useState([]);
    const [allproductCopy, setProductCopy] = useState([]);
    useEffect(() => {
        StoreListData();
    }, [])
    const StoreListData = async () => {
        const response = await adminInstance().get('/getProduct');
        const { code, allproduct } = response.data;
        if (code === 200) {
            setStore(allproduct);
            setProductCopy(allproduct);
        }
    }
    const DeleteProduct = async (_id) => {
        const response = await adminInstance().delete(`/deleteProduct/${_id}`);
        const { code, msg } = response.data;
        if (code === 200) {
            Notification('success', msg);
            setStore((oldArray) => oldArray.filter((el) => el._id !== _id));
            setProductCopy((oldArray) => oldArray.filter((el) => el._id !== _id));
        } else {
            Notification('danger', msg);
        }
    }
    return (
        <AdminWrapper>
            <div className="user-list">
                <div className="container">
                    <h2 className="admin-title">All Product</h2>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="admin-search">
                                <Form inline>
                                    <Button onClick={() => history.push("/admin/addproduct")}>Add Product</Button>
                                </Form>
                            </div>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>Content</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Category</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allproduct && allproduct.map((el, i) => {
                                        return <ProductList element={el} index={i} DeleteProduct={DeleteProduct} />
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
export default ProductStore;

const ProductList = ({ element, index, DeleteProduct }) => {
    const { title, content, _id, price, image,catid,quantity} = element;
    return (
        <tr key={index}>
            <td><img src={image} className="img-size" /></td>
            <td>{title.substring(0, 25) + "..."}</td>
            <td>{content ? content.substring(0, 45) + '...' : ""}</td>
            <td>{price}</td>
            <td>{quantity}</td>
            <td>{catid?catid.name:''}</td>
            <td>
                <div className="action-buttons">
                    <Button className="block-btn" onClick={() => {
                        if (
                            window.confirm(
                                'Are you sure to delete this Product?'
                            )
                        ) {
                            DeleteProduct(_id);
                        }
                    }}>Delete</Button>
                    <Button onClick={() => history.push(`/admin/addproduct/?type=edit&id=${_id}`)} className="approve-btn">Views & edit</Button>
                </div>
            </td>
        </tr>
    )
}

