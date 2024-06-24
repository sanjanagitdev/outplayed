import React, { useState, useEffect, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { adminInstance } from '../../../config/axios';
import { Notification, queryString, ValidateMap } from '../../../function';
import AdminWrapper from '../adminwrapper/wrapper';
import history from '../../../config/history';

const AddMaps = () => {
  const [mapData, setMapData] = useState({
    title: '',
    gametype: false,
    mapid: '',
    maptype: '5vs5',
    imgurl: '',
  });
  const [check, setCheck] = useState(false);
  const [errors, setErrors] = useState({});
  const imageRef = useRef(null);

  const addMaps = async (e) => {
    e.preventDefault();
    const { isValid, errors } = ValidateMap(mapData, imageRef, check);

    if (!isValid) {
      setErrors(errors);
      return;
    }
    const { title, mapid, maptype, gametype } = mapData;
    const payload = gametype ? { title, mapid, maptype } : { title, maptype };
    const data = new FormData();
    data.append('file', imageRef.current.files[0]);
    const response = await adminInstance().post('/addmapimage', data, {
      params: payload,
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
      GetMapsData();
    }
  }, []);
  const updateMaps = async (e) => {
    e.preventDefault();
    const { type, id } = queryString();
    if (type && id) {
      const { title, mapid, maptype, gametype } = mapData;
      const payload = gametype ? { title, mapid, maptype } : { title, maptype };
      const data = new FormData();
      data.append('file', imageRef.current.files[0]);
      const response = await adminInstance().patch(`/updatemap/${id}`, data, {
        params: payload,
      });
      const { code, msg } = response.data;
      if (code === 200) {
        Notification('success', msg);
        history.push('/admin/maps');
      } else {
        Notification('danger', msg);
      }
    }
  };

  const GetMapsData = async () => {
    const { type, id } = queryString();
    if (type && id) {
      const response = await adminInstance().get(`/mapdata/${id}`);
      const { code, mapdata } = response.data;
      if (code === 200) {
        const { title, mapid, imgurl } = mapdata;
        setMapData({
          ...mapData,
          title,
          mapid,
          imgurl,
          gametype: mapid ? true : false,
          maptype: mapid ? '1vs1' : '5vs5',
        });
      }
    }
  };

  const { title, mapid, gametype, imgurl } = mapData;

  return (
    <AdminWrapper>
      <div className="user-list">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2>{check ? 'Update' : 'Add'} Maps</h2>
              <Form onSubmit={check ? updateMaps : addMaps}>
                <Form.Group controlId="formBasicloginone">
                  <Form.Label>Map name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="title"
                    name="name"
                    autoComplete="off"
                    value={title}
                    onChange={(e) =>
                      setMapData({ ...mapData, title: e.target.value })
                    }
                  />
                  {errors.title && (
                    <span style={{ color: 'red' }}>{errors.title}</span>
                  )}
                </Form.Group>
                <Form.Group controlId="formBasicloginone">
                  <Form.Control
                    type="file"
                    placeholder="Selcet a map image"
                    ref={imageRef}
                  />
                  {errors.imgurl && (
                    <span style={{ color: 'red' }}>{errors.imgurl}</span>
                  )}
                  {imgurl && check && <span>{imgurl}</span>}
                </Form.Group>
                <Form.Group controlId="formBasicloginone">
                  <Form.Check
                    label="Select as 1vs1"
                    checked={gametype}
                    onChange={() =>
                      setMapData({ ...mapData, gametype: !gametype })
                    }
                  />
                </Form.Group>
                {gametype && (
                  <Form.Group controlId="formBasicloginone">
                    <Form.Label>Map id</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="1vs1 map id"
                      name="mapid"
                      autoComplete="off"
                      value={mapid}
                      onChange={(e) =>
                        setMapData({
                          ...mapData,
                          mapid: e.target.value,
                          maptype: '1vs1',
                        })
                      }
                    />
                    {errors.mapid && (
                      <span style={{ color: 'red' }}>{errors.mapid}</span>
                    )}
                  </Form.Group>
                )}
                <div className="">
                  <div className="login-button">
                    {check ? (
                      <Button type="submit" className="l-btn">
                        Update Maps
                      </Button>
                    ) : (
                      <Button type="submit" className="l-btn">
                        ADD Maps
                      </Button>
                    )}
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
