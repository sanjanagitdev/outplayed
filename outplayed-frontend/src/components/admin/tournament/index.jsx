import React, { useEffect, useState } from "react";
import AdminWrapper from "../adminwrapper/wrapper";
import { Table, Button, Form } from 'react-bootstrap';
import history from "../../../config/history";
import { adminInstance } from '../../../config/axios';
import { Notification } from '../../../function';

const TournamentList = () => {
    const [alltournament, setStore] = useState([]);
    const [alltournamentCopy, setTournamentCopy] = useState([]);
    useEffect(() => {
        StoreListData();
    }, [])
    const StoreListData = async () => {
        const response = await adminInstance().get('/tournaments');
        const { code, tournaments } = response.data;
        if (code === 200) {
            setStore(tournaments);
            setTournamentCopy(tournaments);
        }
    }
    const DeleteTournament = async (_id) => {
        const response = await adminInstance().delete(`/deleteTournament/${_id}`);
        const { code, msg } = response.data;
        if (code === 200) {
            Notification('success', msg);
            setStore((oldArray) => oldArray.filter((el) => el._id !== _id));
            setTournamentCopy((oldArray) => oldArray.filter((el) => el._id !== _id));
        } else {
            Notification('danger', msg);
        }
    }
    return (
        <AdminWrapper>
            <div className="user-list">
                <div className="container">
                    <h2 className="admin-title">All Tournament</h2>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="admin-search">
                                <Form inline>
                                    <Button onClick={() => history.push("/admin/add-tournament")}>Add Tournament</Button>
                                </Form>
                            </div>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>GameType</th>
                                        <th>PlayerNumbers</th>
                                        <th>TournamentPrize</th>
                                        <th>TournamentType</th>
                                        <th>TournamentStart</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alltournament && alltournament.map((el, i) => {
                                        return <AllTournament element={el} index={i} DeleteTournament={DeleteTournament} />
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
export default TournamentList;

const AllTournament = ({ element, index, DeleteTournament }) => {
    const { title, _id,banner,createdBy,gameType,playerNumbers,tournamentPrize,tournamentStart,tournamentType} = element;
    return (
        <tr key={index}>
            <td><img src={banner} className="img-size" /></td>
            <td>{title.substring(0, 25) + "..."}</td>
            <td>{gameType}</td>
            <td>{playerNumbers}</td>
            <td>{tournamentPrize}</td>
            <td>{tournamentType}</td>
            <td>{tournamentStart}</td> 
            <td>
                <div className="action-buttons">
                    <Button className="block-btn" onClick={() => {
                        if (
                            window.confirm(
                                'Are you sure to delete this Tournament?'
                            )
                        ) {
                            DeleteTournament(_id);
                        }
                    }}>Delete</Button>
                    <Button onClick={() => history.push(`/admin/add-tournament/?type=edit&id=${_id}`)} className="approve-btn">Views & edit</Button>
                </div>
            </td>
        </tr>
    )
}

