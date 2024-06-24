import React, { useState, useEffect, useContext } from "react";
import Helmet from "react-helmet";
import { countries } from "countries-list";
import Layout from "../layout/layout";
import LeftSidebar from "../sidebar/leftsidebar";
import Filter from "./filter-section";
import ScoutnigRight from "./scouting";
import UserContext from "../../context/context";
import {
  JoinScoutingAreaValidation,
  Notification,
  prestige,
} from "../../function";
import { userInstance } from "../../config/axios";

import "./scouting.css";

const Scouting = () => {
  const {
    userDetails: { username, useravatar },
    ContactWithUser,
  } = useContext(UserContext);
  const dataFilterType = [
    { role: "Entry Fragger", checked: false },
    { role: "Caller/ IGl", checked: false },
    { role: "Primary AWper", checked: false },
    { role: "Secondary AWper", checked: false },
    { role: "Lurker", checked: false },
    { role: "Rifler", checked: false },
  ];
  const initialState = { description: "", language: [], roles: [],isdisappears:''};
  const initialRanks = [
    { prestige: "Prestige 1",rank:'1000',prestigemax:'1199' },
    { prestige: "Prestige 2",rank:'1200',prestigemax:'1399' },
    { prestige: "Prestige 3",rank:'1400',prestigemax:'1599' },
    { prestige: "Prestige 4",rank:'1600',prestigemax:'1799'},
    { prestige: "Prestige 5",rank:'1800',prestigemax:'1999'},
    { prestige: "Prestige 6",rank:'2000',prestigemax:'2299'},
    { prestige: "Prestige 7",rank:'2300',prestigemax:'2599'},
    { prestige: "Prestige 8",rank:'2600',prestigemax:'2899'},
    { prestige: "Prestige 9",rank:'2900',prestigemax:'3499' },
    { prestige: "Prestige 10",rank:'3500',prestigemax:'5000'},
  ];
  const [show, setShow] = useState(false);
  const [countriesWithLang, setCountriesWithLang] = useState([]);
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [fetchAllCollections, setFetchAllCollections] = useState([]);
  const [contact, setContact] = useState(false);
  const [filterCheckBoxes, setFilterChcekBoxes] = useState(dataFilterType);
  const [minRank, setMinRank] = useState(initialRanks);
  const [maxRank, setMaxRank] = useState(initialRanks);
   const [getprestigemax, setPrestigemax] = useState(0);
  //These states for filter
  const [filterlang, setFilterLang] = useState([]);
  const [ageCheck, setAgeCheck] = useState(false);
  const [filterMinRank, setFilterMinRank] = useState(null);
  const [filterMaxRank, setFilterMaxRank] = useState(null);
  const [filterCountry, setFilterCountry] = useState(null);

  const [messageData, setMessageData] = useState({
    messageto: "",
    message: "",
    scoutingId: "",
  });

  const setCountryList = () => {
    let oldState = [];
    Object.keys(countries).forEach((element) => {
      oldState.push({
        lang: element,
        name: countries[element].name,
        native: countries[element].native,
      });
    });
    setCountriesWithLang(oldState);
  };
  const GetAllJoinedUsers = async () => {
    try {
      const response = await userInstance().get("/fetchDataForScouting");
      const {
        data: { code, fetchAllCollections },
      } = response;
      if (code === 200) {
        setFetchAllCollections(fetchAllCollections);
      }
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    setCountryList();
    GetAllJoinedUsers();
  }, []);

  const JoinTeamFinder = async () => {
    try {
      const { isValid, errors } = JoinScoutingAreaValidation(data);
      if (!isValid) {
        setErrors(errors);
        return;
      }
      const response = await userInstance().post("/joinTeamFinder", { data });
      const {
        data: { code, msg, errors: servererrors },
      } = response;
      if (code === 200) {
        Notification("success", msg);
        handleClose();
        setData(initialState);
        GetAllJoinedUsers();
      } else if (code === 201) {
        Notification("danger", Object.values(servererrors)[0]);
      } else {
        Notification("danger", msg);
      }
    } catch (error) {
      return error;
    }
  };
  const setSelectData = (type, value) => {
    
    if (type === "roles") {
      let oldState = { ...data };
      const checkExists = oldState[type].filter((el) => el === value);
      if (checkExists.length === 0 && type) {
        setData((preState) => {
          return { ...preState, [type]: [...preState[type], value] };
        });
      }
    } else if (type === "language") {
      value = parseInt(value);
      let oldState = { ...data };
      const checkExists = oldState[type].filter((el) => el === value);
      if (checkExists.length === 0 && type) {
        setData((preState) => {
          return {
            ...preState,
            [type]: [...preState[type], countriesWithLang[value]],
          };
        });
      }
    } else {
      setData({ ...data, [type]: value });
    }
  };
  const handleContactOpenClose = (type, index) => {
    if (type === "open") {
      const {
        joinedUser: { _id: messageto },
        _id: scoutingId,
      } = fetchAllCollections[index];
      setMessageData({ ...messageData, messageto, scoutingId });
    }
    setContact(!contact);
  };

  const setMessage = (e) => {
    const { value } = e.target;
    setMessageData({ ...messageData, message: value });
  };

  const FilterData = (type, valindex,rank,prestigemax) => {
    try {
      if (type === "role") {
        let oldState = [...filterCheckBoxes];
        let { checked } = oldState[valindex];
        oldState[valindex].checked = !checked;
        setFilterChcekBoxes(oldState);
      } else if (type === "language") {
        let oldStateF = [...filterlang];
        let val = valindex.split(" ");
        let filterdLang = countriesWithLang.filter((el) => el.lang === val[0]);
        let filterdchk = oldStateF.filter((el) => el.lang === val[0]);
        if (filterdchk.length === 0) {
          oldStateF.push(filterdLang[0]);
          setFilterLang(oldStateF);
        }
      } else if (type === "minrank") {
        setFilterMinRank(rank);
        setPrestigemax(prestigemax);
      } else if (type === "maxrank") {
        setFilterMaxRank(rank);
        setPrestigemax(prestigemax);
      } else if (type === "age") {
        console.log(type);
        setAgeCheck(!ageCheck);
      } else if (type === "country") {
        setFilterCountry(rank);
      }
    } catch (error) {
      return;
    }
  };

  const sendMessage = () => {
    try {
      const { message, messageto, scoutingId } = messageData;
      if (message.trim() && messageto && scoutingId) {
        ContactWithUser(messageData);
        setContact(false);
        setMessageData({ message: "", messageto: "", scoutingId: "" });
      }
    } catch (error) {
      return error;
    }
  };

  const handleClose = () => {
    setShow(!show);
  };

  //This function is used to filter the data -

  const filterDatav = async (e) => {
    e.preventDefault();
    try {
      //console.log(filterMinRank);
      const rolesData = filterCheckBoxes
        .filter((el) => el.checked)
        .map((el) => el.role);
      const payload = {
        roles: rolesData,
        language: filterlang,
        minrank:filterMinRank,
        maxrank:filterMaxRank,
        prestigemax:getprestigemax
      };
      const response = await userInstance().post("/getfilterdata", payload,);
      const {
        data: { code, fetchAllCollections },
      } = response;
      if (code === 200) {
        setFetchAllCollections(fetchAllCollections);
      }
    } catch (error) {
      return;
    }
  };

  const removeSelected = (type, index) => {
    let oldState = { ...data };
    oldState[type].splice(index, 1);
    setData(oldState);
  };

  const PropsDataForFilter = {
    username,
    useravatar,
    errors,
    countriesWithLang,
    data,
    show,
    handleClose,
    JoinTeamFinder,
    setSelectData,
    dataFilterType,
    minRank,
    maxRank,
    filterCheckBoxes,
    FilterData,
    filterDatav,
    removeSelected,
  };

  return (
    <>
      <Helmet>
        <body className="soutnig-main-page" />
      </Helmet>
      <Layout header={true} footer={true}>
        <div className="main-wrapper">
          <LeftSidebar
            mainmenu={true}
            increase={true}
            community={true}
            voiceserver={true}
          />

          <div className="middle-wrapper">
            <div className="scouting-page">
              <div className="row">
                <div className="col-md-4">
                  <Filter props={PropsDataForFilter} />
                </div>
                <div className="col-md-8">
                  <ScoutnigRight
                    fetchAllCollections={fetchAllCollections}
                    show={contact}
                    handleClose={handleContactOpenClose}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
export default Scouting;
