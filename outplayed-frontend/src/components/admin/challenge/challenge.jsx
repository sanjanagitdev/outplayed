import React, { useEffect } from "react";
import AdminWrapper from "../adminwrapper/wrapper";
import { Table, Button, Modal, Form, FormControl } from 'react-bootstrap';


const AdminChallenge = () => {
    return (
            <AdminWrapper>

                <div className="user-list">

                  

                    <div className="container">
                        <h2 className="admin-title">Challenges</h2>

                        <div className="row">
                   
                            <div className="col-md-12">

                                <div className="admin-search">
                                    <Form inline>
                                        <FormControl type="text" placeholder="Search Challenge" className="mr-sm-2" />
                                        <Button>Search</Button>
                                    </Form>
                                </div>

                            <Table striped bordered hover responsive>
                                    <thead>
                                            <tr>
                                            <th>Title</th>
                                            <th>Price</th>
                                            <th>Category</th>
                                            <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            <tr>
                                            <td>Car for sale</td>
                                            <td>$120</td>
                                            <td>Car</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Button className="block-btn">Delete</Button>
                                                    <Button className="approve-btn">View</Button>
                                                </div> 
                                            </td>
                                            </tr>

                                            <tr>
                                            <td>Car for sale</td>
                                            <td>$120</td>
                                            <td>Car</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Button className="block-btn">Delete</Button>
                                                    <Button className="approve-btn">View</Button>
                                                </div> 
                                            </td>
                                            </tr>

                                            <tr>
                                            <td>Car for sale</td>
                                            <td>$120</td>
                                            <td>Car</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Button className="block-btn">Delete</Button>
                                                    <Button className="approve-btn">View</Button>
                                                </div> 
                                            </td>
                                            </tr>

                                            <tr>
                                            <td>Car for sale</td>
                                            <td>$120</td>
                                            <td>Car</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Button className="block-btn">Delete</Button>
                                                    <Button className="approve-btn">View</Button>
                                                </div> 
                                            </td>
                                            </tr>

                                            <tr>
                                            <td>Car for sale</td>
                                            <td>$120</td>
                                            <td>Car</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Button className="block-btn">Delete</Button>
                                                    <Button className="approve-btn">View</Button>
                                                </div> 
                                            </td>
                                            </tr>




                                    </tbody>
                            </Table>

                            </div>
                        


                        </div>


                    </div>

                </div>
                  
            </AdminWrapper>      
       
    );
  };
  
export default AdminChallenge;