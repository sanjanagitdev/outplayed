import React from 'react';
import './hubs.css';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import advanced from '../../assets/menu/advanced.png';
import premium from '../../assets/menu/premium.png';
import map from '../../assets/hubs/map.png';
import Dropdown from 'react-bootstrap/Dropdown';
//import history from '../../config/history';
import { prestige } from '../../function';

const GatherList = ({
  gatherslist,
  hubscreate: { type, maps, array },
  nextPage,
  previousPage,
  skip,
  selectFilterType,
  checkFirst,
}) => {
  const { t } = useTranslation();
  return (
    <div className="gather-list">
      <h2>{t('hub.gatherlist')}</h2>
      <div className="gather-table">
        <div className="gather-header">
          <div className="gather-type">
            <DropDownItem
              data={type}
              name="Type"
              selectFilterType={selectFilterType}
            />
          </div>
          <div className="gather-name">{t('hub.Name')}</div>
          <div className="gather-prestige">
            <DropDownItem
              data={array}
              name="Prestige"
              selectFilterType={selectFilterType}
            />
          </div>
          <div className="gather-map">
            {t('hub.maps')}
            {/* <DropDownItem data={maps} name="Maps" selectFilterType={selectFilterType} /> */}
          </div>
          <div className="gather-join">{t('hub.join')}</div>
        </div>
        <div className="gather-body">
          {gatherslist.map((el, i) => {
            return <GatherListItem element={el} t={t} index={i} />;
          })}
        </div>
        <div className="gather-footer">
          {checkFirst && (
            <React.Fragment>
              <Button
                className="gathers-btn"
                disabled={skip <= 0 ? true : false}
                onClick={previousPage}
              >
                {t('global.previous')}
              </Button>
              {gatherslist.length > 0 && (
                <Button
                  className="gathers-btn"
                  disabled={gatherslist.length <= 0 ? true : false}
                  onClick={nextPage}
                >
                  {t('global.next')}
                </Button>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};
export default GatherList;
const DropDownItem = ({ data, name, selectFilterType }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {name}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {data.map((el, i) => {
          return (
            <Dropdown.Item
              key={i}
              onClick={(e) => selectFilterType(e, el, name)}
            >
              {el}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};
const GatherListItem = ({ element, index, t }) => {
  const {
    name,
    premium: pri,
    premiumadvanced,
    joinedplayers,
    prestige: elo,
    running,
    _id,
    team1,
    team2,
    cancelled,
    maps,
  } = element;
  let filterSelected = maps.filter((el) => el.open);
  let { mapname, url } =
    filterSelected.length === 1
      ? { mapname: filterSelected[0].title, url: filterSelected[0].imgurl }
      : { mapname: 'Picking..', url: map };
  const AllPlayers = [...joinedplayers, ...team1, ...team2];
  const render = <img src={premium} alt="premium" />;
  return (
    <div className="gather-list-view" key={index}>
      <div className="gather-type">
        <span>
          {pri && !premiumadvanced
            ? render
            : premiumadvanced && !pri
            ? render
            : premiumadvanced && pri
            ? render
            : null}
        </span>
        <span>{premiumadvanced && <img src={advanced} alt="advanced" />}</span>
      </div>
      <div className="gather-name">
        <span>
          {name}’s {t('hub.hub')}
        </span>
      </div>
      <div className="gather-prestige">
        <span>
          <img src={prestige(elo)} alt="prestige" />
        </span>
      </div>
      <div className="gather-map">
        <span>
          <img src={url} alt="prestige" /> {mapname}
        </span>
      </div>
      <div className="gather-join">
        <span>{AllPlayers.length}/4</span>{' '}
        <Link to={`/insidegamefirst/?id=${_id}`} className="gathers-btn gather">
          {running && !cancelled
            ? 'Open lobby'
            : !running && cancelled
            ? 'cancelled'
            : 'Summary'}
        </Link>
      </div>
    </div>
  );
};
