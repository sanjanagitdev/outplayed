import React from 'react';
import './hubs.css';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
//import { Link, NavLink } from "react-router-dom";
import lock from '../../assets/hubs/lock-icon.png';
import arrow from '../../assets/hubs/arrow.png';

const CreateHub = ({
  hubscreate,
  hubscreate: { array, premium, premiumadvanced },
  setHubsCreate,
  errors,
  CreateHubs,
  selectPrestige,
}) => {
  const { t } = useTranslation();
  return (
    <div className="create-hub">
      <div className="play-hub-form">
        <img src={lock} alt="lock" />
        <h3>{t('hub.create-hub')}</h3>
        <p>
          {t('hub.only')} <span>{t('hub.premium')}</span> {t('hub.players')}
        </p>
        <Form onSubmit={CreateHubs}>
          <Form.Group
            controlId="formBasicloginone"
            className="custom-select-box"
          >
            <Form.Label>{t('hub.minimumprestige')}</Form.Label>
            <Form.Control as="select" onClick={selectPrestige}>
              <option>{t('hub.choseprestige')}</option>
              {array.map((el, i) => {
                return (
                  <option key={i} value={el}>
                    {el}
                  </option>
                );
              })}
            </Form.Control>
            <img src={arrow} alt="arrow" />
            {errors.prestige && (
              <span className="alert-red">{errors.prestige}</span>
            )}
          </Form.Group>
          <Form.Group controlId="formBasicloginone">
            <p className="check-box">
              <Form.Check
                type="checkbox"
                checked={premium}
                onChange={() =>
                  setHubsCreate({ ...hubscreate, premium: !premium })
                }
              />{' '}
              {t('hub.only')}{' '}
              <span className="creame-text">{t('hub.premium')}</span>
            </p>
            <p className="check-box">
              <Form.Check
                type="checkbox"
                checked={premiumadvanced}
                onChange={() =>
                  setHubsCreate({
                    ...hubscreate,
                    premiumadvanced: !premiumadvanced,
                  })
                }
              />{' '}
              {t('hub.only')}{' '}
              <span className="creame-text">{t('hub.premium')}</span>{' '}
              {t('hub.and')}{' '}
              <span className="green-text">{t('hub.advance')}</span>
            </p>
          </Form.Group>
          <div className="hubs-button">
            <Button type="submit" className="hubs-btn">
              {t('hub.createhubs')}
            </Button>
          </div>
          {errors.exist && (
            <p className="play-hub-text alert-red">{errors.exist}</p>
          )}
          {errors.ispremium && (
            <p className="play-hub-text alert-red">{errors.ispremium}</p>
          )}
        </Form>
      </div>
    </div>
  );
};
export default CreateHub;
