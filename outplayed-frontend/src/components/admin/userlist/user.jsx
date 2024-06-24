import React, { useEffect ,useState} from "react";
import AdminWrapper from "../adminwrapper/wrapper";
import { Table, Button, Modal, Form, FormControl } from 'react-bootstrap';
import { adminInstance } from '../../../config/axios';
import history from "../../../config/history";
import { Notification, queryString } from '../../../function';


const AdminUser = () => {
    const [allalluser, setAlluser] = useState([]);
    const [allalluserCopy, setAlluserCopy] = useState([]);
    const [isturnament, setisTurnament] = useState(false);
    const [isladders, setisLadders] = useState(false);
    useEffect(() => {
        StoreListData();
    }, []);
    const StoreListData = async () => {
        const response = await adminInstance().get('/alluserlist');
        const { code, alluser } = response.data;
        if (code === 200) {
            setAlluser(alluser);
            setAlluserCopy(alluser);
        }
    }
    const isRole = async(type,id,status) =>{
        const response = await adminInstance().post("/updateuserRole",{type:type,id:id,status:status}); 
        const { code, msg } = response.data;
        if (code === 200) {
        StoreListData();
        Notification('success', msg);
        } else {
        Notification('danger', msg);
        }
    }
    // const DeleteProduct = async (_id) => {
    //     const response = await adminInstance().delete(`/deleteProduct/${_id}`);
    //     const { code, msg } = response.data;
    //     if (code === 200) {
    //         Notification('success', msg);
    //     } else {
    //         Notification('danger', msg);
    //     }
    // }
    return (
            <AdminWrapper>

                <div className="user-list">

                  

                    <div className="container">
                        <h2 className="admin-title">User List</h2>

                        <div className="row">
                   
                            <div className="col-md-12">

                                <div className="admin-search">
                                    <Form inline>
                                        <FormControl type="text" placeholder="Search User" className="mr-sm-2" />
                                        <Button>Search</Button>
                                    </Form>
                                </div>

                            <Table striped bordered hover responsive>
                                    <thead>
                                            <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {allalluser && allalluser.map((el, i) => { 
                                           let {username,email,isroles,_id,isladders,isturnament} = el?el:{} 
                                           let  isladdersStatus=isladders?false:true;
                                           let  isturnamentStaus=isturnament?false:true;
                                           let turnamentmsg=isturnament?'Are you sure to delete Turnament Role?':'Are you sure to Assign Turnament Role?';
                                           let laddermsg=isturnament?'Are you sure to delete Ladder Role?':'Are you sure to Assign Ladder Role?';
                                       return (<>
                                               <tr>
                                            <td>{username}</td>
                                            <td>{email}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    {/* <Button className="block-btn" onClick={() => {
                                                    if (
                                                    window.confirm(
                                                    'Are you sure to delete this Product?'
                                                    )
                                                    ) {
                                                    DeleteProduct(_id);
                                                    }
                                                    }}>Delete</Button> */}
                                                   {/* { <Button className="block-btn">Block</Button>
                                                    <Button className="approve-btn">Approved</Button>} */}
                                                    <Button  onClick={() => { if (
                                                    window.confirm(
                                                        turnamentmsg
                                                    )
                                                    ) {
                                                    isRole('isturnament',_id,isturnamentStaus);
                                                    }
                                                    }}  className= {isturnament?'block-btn':'approve-btn'}> {isturnament?'Remove Turnament':'Assign Turnament'}</Button>
                                                    <Button onClick={() => { if (
                                                    window.confirm(
                                                    'Are you sure to Assign Ladder Role?'
                                                    )
                                                    ) {
                                                    isRole('isladders',_id,isladdersStatus);
                                                    }
                                                    }} className={isladders?'block-btn':'approve-btn'}> 
                                                     {isladders?'Remove Ladders':'Assign Ladders'} 
                                                      </Button>
                                                </div> 
                                            </td>
                                            </tr>
                                         </>
                                           )})}
                                    </tbody>
                            </Table>

                            </div>
                        


                        </div>


                    </div>

                </div>
                  
            </AdminWrapper>      
       
    );
  };
  
export default AdminUser;