import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Dropdown } from 'react-bootstrap';
import { adminInstance } from '../../../config/axios';
import { Notification, queryString } from '../../../function';
import AdminWrapper from "../adminwrapper/wrapper";
import history from '../../../config/history';

const AddNews = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Select category");
    const [check, setCheck] = useState(false);
    const [imgurl, setImgUrl] = useState('');
    const [categoryList, setCategoryList] = useState([{ type: 'Tournaments', active: false }, { type: 'Ladders', active: false }, { type: 'Gathers', active: false }, { type: 'Matchmaking', active: false }]);
    const imgRef = useRef(null);
    const addNews = async e => {
        e.preventDefault();
        if (category !== 'Select category') {
            let checkValid = imgRef.current.files[0].type.split('/');
            const checkValue = checkValid[1]
            if ((checkValue === 'png') || (checkValue === 'jpg') || (checkValue === 'jpeg')) {
                const data = new FormData();
                data.append("file", imgRef.current.files[0]);
                const payload = { title, content, category, }
                const response = await adminInstance().post("/addnews", data, {
                    params: payload
                });
                const { code, msg } = response.data;
                if (code === 200) {
                    history.push('/admin/category');
                    Notification('success', msg);
                }
            } else {
                Notification('warning', 'Please select png or jpg or jpeg type file');
            }
        } else {
            Notification('warning', 'Please select news category');
        }

    };

    useEffect(() => {
        const { type, id } = queryString();
        if (type && id) {
            setCheck(true);
            GetNesData();
        }
    }, []);
    const updateNews = async (e) => {
        e.preventDefault();
        const { type, id } = queryString();
        if (type && id) {
            if (category !== 'Select category') {
                let checkValid = imgRef.current.files[0] ? imgRef.current.files[0].type.split('/') : false;
                if (checkValid) {
                    const checkValue = checkValid[1]
                    if ((checkValue === 'png') || (checkValue === 'jpg') || (checkValue === 'jpeg')) {
                        updateFromBoth(id)
                    } else {
                        Notification('warning', 'Please select png or jpg or jpeg type file');
                    }
                } else {
                    updateFromBoth(id)
                }
            } else {
                Notification('warning', 'Please select news category');
            }
        }

    }
    const updateFromBoth = async (id) => {
        const data = new FormData();
        data.append("file", imgRef.current.files[0]);
        const payload = { title, content, category, }
        const response = await adminInstance().patch(`/updatenews/${id}`, data, {
            params: payload
        });
        const { code, msg } = response.data;
        if (code === 200) {
            Notification('success', msg);
        } else {
            Notification('danger', msg);
        }
    }
    const GetNesData = async () => {
        const { type, id } = queryString();
        if (type && id) {
            const response = await adminInstance().get(`/getnewsdata/${id}`);
            const { code, data } = response.data;
            if (code === 200) {
                const { title, content, imgurl, category } = data;
                setTitle(title);
                setContent(content);
                selectCategory(category);
                setImgUrl(imgurl);
            }
        }
    }
    const selectCategory = (type) => {
        const oldState = [...categoryList];
        oldState.forEach(el => {
            if (el.type === type) {
                setCategory(type);
                el.active = true;
            } else {
                el.active = false;
            }
        })
        setCategoryList(oldState);
    }
    return (
        <AdminWrapper>
            <div className="user-list">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>{check ? 'Update' : 'Add'} News</h2>
                            <Form onSubmit={check ? updateNews : addNews}>
                                <Form.Group controlId="formBasicloginone">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="title"
                                        name="title"
                                        autoComplete="off"
                                        value={title}
                                        required={true}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicloginone">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                            {category}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            {categoryList && categoryList.map((el, i) => {
                                                return (
                                                    <Dropdown.Item key={i} active={el.active} onClick={() => selectCategory(el.type)}>{el.type}</Dropdown.Item>
                                                )
                                            })}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Content</Form.Label>
                                    <Form.Control
                                        as="textarea" rows="5"
                                        type="text"
                                        placeholder="Content"
                                        name="content"
                                        autoComplete="off"
                                        required={true}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </Form.Group>
                                <div className="">
                                    {check && <div className="imagebox">
                                        <img src={imgurl} className="imagesize" />
                                    </div>}
                                    <span> <Form.File id="exampleFormControlFile1" label="Select image" required={check ? false : true} ref={imgRef} /></span>
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
export default AddNews;