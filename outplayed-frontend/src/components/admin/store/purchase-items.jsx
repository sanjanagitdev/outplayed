import React, { useEffect, useState } from "react";
import AdminWrapper from "../adminwrapper/wrapper";
import { Table, Button, Form } from 'react-bootstrap';
import history from "../../../config/history";
import { adminInstance } from '../../../config/axios';
import { Notification } from '../../../function';

const PurchaseItems = () => {
    const [allitemlist, setStore] = useState([]);
    const [allitemlistCopy, setProductCopy] = useState([]);
    useEffect(() => {
        StoreListData();
    }, [])
    const StoreListData = async () => {
        const response = await adminInstance().get('/allitemPruchesList');
        console.log(response.data);
        const { code, allitemlist } = response.data;
        if (code === 200) {
            setStore(allitemlist);
            setProductCopy(allitemlist);
        }
    }
    return (
        <AdminWrapper>
            <div className="user-list">
                <div className="container">
                    <h2 className="admin-title">All Purchase Items</h2>
                    <div className="row">
                        <div className="col-md-12">
                    
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>User Name</th>
                                        <th>Address</th>
                                        <th>Phone</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allitemlist && allitemlist.map((el, i) => {
                                        return <ProductList element={el} index={i}  />
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
export default PurchaseItems;

const ProductList = ({ element, index }) => {
    let {address,createdAt,phone,pid,purchaseby} = element;
    let {title}=pid?pid:{}
    let {username}=purchaseby?purchaseby:{}
    return (
        <tr key={index}>
            <td>{title}</td>
            <td>{username}</td>
            <td>{address}</td>
            <td>{phone}</td>
            <td>{createdAt}</td>
        </tr>
    )
}

