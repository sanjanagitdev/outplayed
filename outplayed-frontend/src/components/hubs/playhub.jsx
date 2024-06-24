import React from "react";
import {useTranslation} from 'react-i18next'
import "./hubs.css";
import { Form, Button } from 'react-bootstrap';
// import { Link, NavLink } from "react-router-dom";
// import eye from "../../assets/news/eye-icon.png";
import arrow from "../../assets/hubs/arrow.png";

const PlayHub = ({ onChange, hubscreate: { name, array }, selectPrestige, serchHubs, errors }) => {
    const {t} = useTranslation();
    return (
        <div className="play-hub">
            <div className="play-hub-form">
                <h3>{t('hub.playhub')}</h3>
                <p>{t('hub.findahub')}</p>
                <Form onSubmit={serchHubs}>
                    <Form.Group controlId="formBasicloginone" className="custom-select-box">
                        <Form.Label>{t('hub.minimumprestige')}:</Form.Label>
                        <Form.Control as="select" onClick={selectPrestige}>
                            {array.map((el, i) => {
                                return (
                                    <option key={i} value={el}>{el}</option>
                                )
                            })}
                        </Form.Control>
                        <img src={arrow} alt="arrow" />
                        {errors.prestige && <span className='alert-red'>{errors.prestige}</span>}
                    </Form.Group>
                    <Form.Group controlId="formBasicloginone">
                        <Form.Label>{t('hub.hubname')}:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search hub's name..."
                            name="name"
                            autoComplete="off"
                            value={name}
                            onChange={(e) => onChange(e)}
                        />
                        {errors.name && <span className='alert-red'>{errors.name}</span>}
                    </Form.Group>
                    <div className="hubs-button">
                        <Button type="submit" className="hubs-btn">{t('hub.search-hub')}</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};
export default PlayHub;