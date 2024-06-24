import React, { useState, useEffect } from 'react';
import './hubs.css';
//import { Link, NavLink } from "react-router-dom";
import Layout from '../layout/layout';
import LeftSidebar from '../sidebar/leftsidebar';
//import eye from "../../assets/news/eye-icon.png";
import RightSidebar from '../sidebar/rightsidebar';
import PlayHub from './playhub';
import CreateHub from './createhub';
import GatherList from './gatherlist';
import { hubsInstance } from '../../config/axios';
import {
  validateHubsCreate,
  validateHubsSearch,
  Notification,
} from '../../function';
import { GetCreatedHubs } from '../../socket/index';
import MonthlyRanking from './monthlyrank';

let initialState = {
  name: '',
  array: [
    'Prestige 1',
    'Prestige 2',
    'Prestige 3',
    'Prestige 4',
    'Prestige 5',
    'Prestige 6',
    'Prestige 7',
    'Prestige 8',
    'Prestige 9',
    'Prestige 10',
    'Show all',
  ],
  premium: false,
  premiumadvanced: false,
  prestige: '',
  maps: [
    'de_dust2',
    'de_mirage',
    'de_cache',
    'de_overpass',
    'de_train',
    'de_inferno',
    'de_vertigo',
    'de_nuke',
  ],
  type: ['Premium', 'Premium/Advanced', 'Normal hubs', 'Show all'],
};
const Hubs = () => {
  const limit = 8;
  const [hubscreate, setHubsCreate] = useState(initialState);
  const [gatherslist, setGatherList] = useState([]);
  const [gatherListCopy, setGatherListCopy] = useState([]);
  const [errors, setErrors] = useState({});
  const [errors2, setErrors2] = useState({});
  const [skip, setSkip] = useState(0);
  const [checkFirst, setFirst] = useState(false);
  const [MonthlyRank, SetMonthlyRanking] = useState([]);
  const [MonthlyRankCopy, SetMonthlyRankingCopy] = useState([]);
  const [UpDown, setUpDown] = useState({
    rank: false,
    username: false,
    monthlyhubpoint: false,
    win: false,
    loss: false,
    winpercent: false,
  });
  const nextPage = () => {
    setSkip(skip + limit);
  };
  const previousPage = () => {
    setSkip(skip - limit);
  };
  const onChange = (e) => {
    const { value, name } = e.target;
    setHubsCreate({ ...hubscreate, [name]: value });
  };
  const CreateHubs = async (e) => {
    e.preventDefault();
    const { premium, premiumadvanced, prestige } = hubscreate;
    const payload = { prestige, premiumadvanced, premium };
    const { isValid, errors } = validateHubsCreate(payload);
    setErrors(errors);
    if (!isValid) {
      return;
    }
    const {
      data: { code, msg, errors: servererrors },
    } = await hubsInstance().post('/createhubs', payload);
    if (code === 200) {
      Notification('success', msg);
    } else if (code === 201) {
      setErrors(servererrors);
    } else {
      Notification('danger', msg);
    }
  };
  const selectPrestige = (e) => {
    setHubsCreate({ ...hubscreate, prestige: e.target.value });
  };

  useEffect(() => {
    GetCreatedHubs(() => {
      GatherListData();
    });
    GatherListData();
  }, [skip, limit]);

  const GatherListData = async () => {
    try {
      const { name, prestige } = hubscreate;

      const {
        data: { code, gatherslist, MonthlyRank },
      } = await hubsInstance().get(`/listgather`, {
        params: {
          skip,
          limit,
          name,
          prestige: prestige === 'Show all' ? '' : prestige,
        },
      });
      if (code === 200) {
        if (skip === 0 && limit === 8 && gatherslist.length > 0) {
          setGatherList(gatherslist);
          setGatherListCopy(gatherslist);
          setFirst(true);
        } else {
          setGatherList(gatherslist);
          setGatherListCopy(gatherslist);
        }
        SetMonthlyRanking(MonthlyRank);
        SetMonthlyRankingCopy(MonthlyRank);
      }
    } catch (e) {
      return e;
    }
  };
  const serchHubs = (e) => {
    e.preventDefault();
    // const { name, prestige } = hubscreate;
    // const { isValid, errors } = validateHubsSearch({ name, prestige });
    // setErrors2(errors);
    // if (!isValid) {
    //     return;
    // }

    GatherListData();
  };

  const selectFilterType = (e, element, type) => {
    e.preventDefault();
    if (type === 'Type') {
      if (element === 'Premium') {
        const filterPremium = gatherListCopy.filter(
          (el) => el.premium && !el.premiumadvanced
        );
        setGatherList(filterPremium);
      } else if (element === 'Premium/Advanced') {
        const filterPremiumAdvanced = gatherListCopy.filter(
          (el) => el.premium && el.premiumadvanced
        );
        setGatherList(filterPremiumAdvanced);
      } else if (element === 'Normal hubs') {
        const filternormal = gatherListCopy.filter(
          (el) => !el.premium && !el.premiumadvanced
        );
        setGatherList(filternormal);
      } else if (element === 'Show all') {
        setGatherList(gatherListCopy);
      }
    } else if (type === 'Prestige') {
      if (element === 'Show all') {
        setGatherList(gatherListCopy);
      } else {
        const filterPrestige = gatherListCopy.filter(
          (el) => el.prestige === element
        );
        setGatherList(filterPrestige);
      }
    }
  };

  const SortData = (type) => {
    let OldState = [...MonthlyRankCopy];
    OldState = OldState.sort((a, b) => {
      if (typeof a[type] === 'string' && typeof b[type] === 'string') {
        return UpDown[type]
          ? a[type].localeCompare(b[type])
          : b[type].localeCompare(a[type]);
      } else {
        return UpDown[type] ? b[type] - a[type] : a[type] - b[type];
      }
    });
    SetMonthlyRanking(OldState);
    setUpDown({ ...UpDown, [type]: !UpDown[type] });
  };
  return (
    <Layout header={true} footer={true}>
      <div className="hubs-page">
        <div className="main-wrapper">
          <LeftSidebar
            mainmenu={true}
            increase={true}
            community={true}
            voiceserver={true}
          />
          <div className="middle-wrapper">
            <div className="hubs-top-section">
              <PlayHub
                onChange={onChange}
                hubscreate={hubscreate}
                selectPrestige={selectPrestige}
                serchHubs={serchHubs}
                errors={errors2}
              />
              <CreateHub
                onChange={onChange}
                hubscreate={hubscreate}
                setHubsCreate={setHubsCreate}
                errors={errors}
                CreateHubs={CreateHubs}
                selectPrestige={selectPrestige}
              />
            </div>
            <div className="hubs-gather-list">
              <GatherList
                gatherslist={gatherslist}
                hubscreate={hubscreate}
                nextPage={nextPage}
                previousPage={previousPage}
                skip={skip}
                selectFilterType={selectFilterType}
                checkFirst={checkFirst}
              />
            </div>
            <div className="hubs-gather-matchmaking">
              <MonthlyRanking
                MonthlyRank={MonthlyRank}
                SortData={SortData}
                UpDown={UpDown}
              />
            </div>
          </div>
          <RightSidebar />
        </div>
      </div>
    </Layout>
  );
};
export default Hubs;
