import React, { useEffect, useState } from "react";
import AdminWrapper from "../adminwrapper/wrapper";
import { Table, Button, Form, FormControl } from 'react-bootstrap';
import history from "../../../config/history";
import { adminInstance } from '../../../config/axios';
import { Notification } from '../../../function';

const AdminCategory = () => {
    const [allnews, setNews] = useState([]);
    const [allnewsCopy, setNewsCopy] = useState([]);
    const [search, setSearch] = useState('');
    useEffect(() => {
        NewsListData();
    }, [])
    const NewsListData = async () => {
        const response = await adminInstance().get('/getnews');
        const { code, allnews } = response.data;
        if (code === 200) {
            setNews(allnews);
            setNewsCopy(allnews);
        }
    }
    const HandlDeleteNews = async (_id) => {
        const response = await adminInstance().delete(`/deletenews/${_id}`);
        const { code, msg } = response.data;
        if (code === 200) {
            Notification('success', msg);
            setNews((oldArray) => oldArray.filter((el) => el._id !== _id));
            setNewsCopy((oldArray) => oldArray.filter((el) => el._id !== _id));
        } else {
            Notification('danger', msg);
        }
    }
    const searchCategory = e => {
        try {
            let { value } = e.target;
            const exp = new RegExp(value.toLowerCase());
            const filteredData = allnewsCopy.filter(item =>
                exp.test(item.category.toLowerCase())
            );
            setNews(filteredData);
            setSearch(value);
        } catch (e) {
            return 0;
        }
    };
    return (
        <AdminWrapper>
            <div className="user-list">
                <div className="container">
                    <h2 className="admin-title">News List</h2>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="admin-search">
                                <Form inline>
                                    <FormControl type="text" placeholder="Search Category"
                                        value={search} className="mr-sm-2" onChange={(e) => searchCategory(e)} />
                                    <Button onClick={() => history.push("/admin/addnews")}>Add news</Button>
                                </Form>
                            </div>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>Content</th>
                                        <th>Category</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allnews && allnews.map((el, i) => {
                                        return <NewsList element={el} index={i} HandlDeleteNews={HandlDeleteNews} />
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
export default AdminCategory;

const NewsList = ({ element, index, HandlDeleteNews }) => {
    const { title, content, _id, category, imgurl } = element;
    return (
        <tr key={index}>
            <td><img src={imgurl} className="img-size" /></td>
            <td>{title.substring(0, 25) + "..."}</td>
            <td>{content ? content.substring(0, 45) + '...' : ""}</td>
            <td>{category}</td>
            <td>
                <div className="action-buttons">
                    <Button className="block-btn" onClick={() => {
                        if (
                            window.confirm(
                                'Are you sure to delete this news?'
                            )
                        ) {
                            HandlDeleteNews(_id);
                        }
                    }}>Delete</Button>
                    <Button onClick={() => history.push(`/admin/addnews/?type=edit&id=${_id}`)} className="approve-btn">Views & edit</Button>
                </div>
            </td>
        </tr>
    )
}

