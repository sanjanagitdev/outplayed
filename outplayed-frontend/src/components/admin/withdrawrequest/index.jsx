import React, { useEffect, useState } from "react";
import AdminWrapper from "../adminwrapper/wrapper";
import { Table, Button } from 'react-bootstrap';
import { adminInstance } from '../../../config/axios';
import { Notification } from '../../../function';

const AllWithdrawRequest = () => {
    const [reports, setReports] = useState([]);
    const [isLock, setIsLock] = useState(false);



    useEffect(() => {
        //Use Effect function for fetch all data;
        withdrawRequestsList();
    }, []);

    const withdrawRequestsList = async () => {
        const response = await adminInstance().get('/listallwithdrawRequest');
        const { code, withdrawRequest } = response.data;
        if (code === 200) {
            setReports(withdrawRequest);
        }
    }

    const payOutUser = async (amount, requestid, email_address) => {
        try {
            setIsLock(true);
            const response = await adminInstance().post("/payoutUser", { amount, requestid, email_address });
            const { data: { code, msg } } = response;
            if (code === 200) {
                Notification('success', msg);
                withdrawRequestsList();
                setIsLock(false)
            } else {
                Notification('danger', msg);
                setIsLock(false)
            }
        } catch (error) {
            return error
        }
    }

    return (
        <AdminWrapper>
            <div className="user-list">
                <div className="container">
                    <h2 className="admin-title">All Withdraw requests</h2>
                    <div className="row">

                        <div className="col-md-12">
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>S.N</th>
                                        <th>Requested by</th>
                                        <th>Amount</th>
                                        <th>Paypal account</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports && reports.map((el, i) => {
                                        return <RequestList element={el} index={i} payOutUser={payOutUser} isLock={isLock} />
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
export default AllWithdrawRequest;

const RequestList = ({ element, index, payOutUser, isLock }) => {
    const { approved, requestedBy: { username, paypalAccount }, amount, _id } = element;
    return (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{username}</td>
            <td>{amount}</td>
            <td>{paypalAccount}</td>
            <td>
                {!approved ? <div className="action-buttons">
                    <Button disabled={isLock} className="approve-btn" onClick={() => {
                        if (
                            window.confirm(
                                'Are you sure to approve this request ?'
                            )
                        ) {
                            payOutUser(amount, _id, paypalAccount);
                        }
                    }}>Approve</Button>
                </div> : 'Approved'}

            </td>
        </tr>
    )
}


