import React, { useState, useEffect, useRef } from "react";
import { Form, Button } from 'react-bootstrap';
import { adminInstance } from '../../../config/axios';
import { Notification, queryString, ValidateMap } from '../../../function';
import AdminWrapper from "../adminwrapper/wrapper";
import history from '../../../config/history';

const AddMaps = () => {
    const [mapData, setMapData] = useState({ title: '', gametype: false, mapid: '', maptype: '', imgurl: '' })
    const [check, setCheck] = useState(false);
    const [errors, setErrors] = useState({});
    const imageRef = useRef(null);


    const addMaps = async e => {
        e.preventDefault();
        const { isValid, errors } = ValidateMap(mapData, imageRef);
        console.log(isValid, errors);
        if (!isValid) {
            setErrors(errors);
        }
        const data = new FormData();
        data.append("file", imageRef.current.files[0]);
        const response = await adminInstance().post("/addmapimage", data, {
            params: mapData
        });
        const { code, msg } = response.data;
        if (code === 200) {
            history.push('/admin/maps');
            Notification('success', msg);
        }
    };

    useEffect(() => {
        const { type, id } = queryString();
        if (type && id) {
            setCheck(true);
            // GetMapsData();
        }
    }, []);
    const updateMaps = async (e) => {
        e.preventDefault();
        const { type, id } = queryString();
        if (type && id) {
            const { isValid, errors } = ValidateMap(mapData, imageRef);
            if (!isValid) {
                setErrors(errors);
            }
            const data = new FormData();
            data.append("file", imageRef.current.files[0]);
            const response = await adminInstance().patch(`/updatemap/${id}`, data, {
                params: mapData
            });
            const { code, msg } = response.data;
            if (code === 200) {
                Notification('success', msg);
            } else {
                Notification('danger', msg);
            }
        }
    }

    const GetMapsData = async () => {
        const { type, id } = queryString();
        if (type && id) {
            const response = await adminInstance().get(`/mapdata/${id}`);
            const { code, data } = response.data;
            if (code === 200) {
                setMapData(data)
            }
        }
    }
    const { title, mapid, gametype, imgurl } = mapData;

    return (
        <AdminWrapper>
            <div className="user-list">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>{check ? 'Update' : 'Add'} Maps</h2>
                            <Form onSubmit={check ? addMaps : updateMaps}>
                                <Form.Group controlId="formBasicloginone">
                                    <Form.Label>Map name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="title"
                                        name="name"
                                        autoComplete="off"
                                        value={title}
                                        onChange={(e) => setMapData({ ...mapData, title: e.target.value })}
                                    />
                                    {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
                                </Form.Group>
                                <Form.Group controlId="formBasicloginone">
                                    <Form.Label>Map id</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="1vs1 map id"
                                        name="mapid"
                                        autoComplete="off"
                                        value={mapid}
                                        onChange={(e) => setMapData({ ...mapData, mapid: e.target.value })}
                                    />
                                    {errors.name && <span style={{ color: 'red' }}>{errors.mapid}</span>}
                                </Form.Group>
                                <Form.Group controlId="formBasicloginone">
                                    <Form.Control
                                        type="file"
                                        placeholder="Selcet a map image"
                                        ref={imageRef}
                                    />
                                    {errors.name && <span style={{ color: 'red' }}>{errors.imgurl}</span>}
                                </Form.Group>
                                <div className="">
                                    <div className="login-button">
                                        {check ? <Button type="submit" className="l-btn" >
                                            Update Maps
                                    </Button> : <Button type="submit" className="l-btn" >
                                                ADD Maps
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
export default AddMaps;