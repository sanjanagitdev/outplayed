import React, { useState, useRef, useContext } from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import countryList from 'react-select-country-list';
import { Link } from 'react-router-dom';
import { Button, Tabs, Tab, Form, Dropdown } from 'react-bootstrap';
import copy from 'copy-to-clipboard';
import { userInstance } from '../../config/axios';
import { Notification, validateTeamCreation } from '../../function/index';
import UserContext from '../../context/context';
import PopupWrapper from '../popups/popupwrapper';
import teamicon from '../../assets/header/team-icon.png';
import user from '../../assets/team/user-icon.png';
import chat from '../../assets/friend/chat.png';
import arrow from '../../assets/header/arrow-down.png';
import profile from '../../assets/friend/profileimg.png';
import userIcon from '../../assets/header/user-icon.png';

const Team = () => {
  const { t } = useTranslation();
  const {
    userDetails: { teams, _id, friends },
  } = useContext(UserContext);

  const [show, setShow] = useState(false);
  const [key, setKey] = useState('createteam');
  const [teamid, setTeamid] = useState('');
  const [renderbutton, setRenderButton] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [invitedMember, setInvitedMember] = useState([]);
  const [createT, setCreateT] = useState(false);
  const [isCaptain, setActivecaptain] = useState();
  const handleClose = () => {
    setShow(false);
    setKey('createteam');
    setTeamid('');
    setRenderButton(false);
  };
  const handleShow = () => {
    setShow(true);
    setCreateT(true);
  };
  const imgRef = useRef(null);
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [country, SetCountry] = useState(null);
  const [errors, setErrors] = useState({});
  const countrylist = countryList().getData();
  const changeHandler = (country) => {
    SetCountry(country);
  };

  const CreateMyTeam = async (e) => {
    e.preventDefault();
    let checkValid = imgRef.current.files[0]
      ? imgRef.current.files[0].type.split('/')
      : false;
    let payload = { name, tag, country, checkValid };
    const { errors, isValid } = validateTeamCreation(payload);
    console.log(errors);
    setErrors(errors);
    if (!isValid) {
      return;
    }
    addData();
  };
  const addData = async () => {
    const data = new FormData();
    data.append('file', imgRef.current.files[0]);
    const payload = { name, tag, country };
    const response = await userInstance().post(`/createteam`, data, {
      params: payload,
    });
    const { code, msg, teamid } = response.data;
    if (code === 200) {
      Notification('success', msg);
      setRenderButton(true);
      setTeamid(teamid);
    } else {
      Notification('danger', msg);
    }
  };

  const getProfiles = async (e) => {
    try {
      const { value } = e.target;
      if (value.trim()) {
        const exp = new RegExp(value.toLowerCase());
        let filteruser = friends
          .filter((el) => exp.test(el.bothfriends[0].username.toLowerCase()))
          .map((el) => el.bothfriends[0]);
        setProfiles(filteruser);
        // const response = await userInstance().get(`/searchuser/${value}`);
        // const {
        //   data: { code, profileList },
        // } = response;
        // console.log(profileList);
        // console.log(friends);
        // if (code === 200) {
        //   setProfiles(profileList);
        // }
      } else {
        setProfiles([]);
      }
    } catch (error) {
      return error;
    }
  };
  const selectMember = (i) => {
    const oldState = [...profiles];
    let oldStateInvited = [...invitedMember];
    if (oldStateInvited.length <= 3) {
      const { _id } = oldState[i];
      const checkExist = oldStateInvited.filter((el) => el._id === _id);
      if (checkExist.length === 0) {
        oldStateInvited.push(oldState[i]);
        setInvitedMember(oldStateInvited);
        setProfiles([]);
      } else {
        setErrors({ err: 'Already selected' });
      }
    } else {
      setErrors({ err: 'You can select only up to 4 players' });
    }
  };

  const removeMember = (_id) => {
    let oldStateInvited = [...invitedMember];
    const checkExist = oldStateInvited.filter((el) => el._id !== _id);
    setInvitedMember(checkExist);
  };
  const assignCaptain = (id) => {
    let oldStateInvited = [...invitedMember];
    oldStateInvited.forEach((el) => {
      if (el._id === id) {
        setActivecaptain(id);
        el.active = true;
      } else {
        el.active = false;
      }
    });
    setInvitedMember(oldStateInvited);
  };

  const sendInvitation = async (e) => {
    try {
      e.preventDefault();
      if (invitedMember.length > 0) {
        const inviteArray = invitedMember.map((el) => {
          return el._id;
        });
        const payload = { invitedmembers: inviteArray, teamid, isCaptain };
        const response = await userInstance().post('/inviteinteam', payload);
        const {
          data: { code, msg },
        } = response;
        if (code === 200) {
          Notification('success', 'Invited successfully');
          handleClose();
          setInvitedMember([]);
          setProfiles([]);
        } else {
          Notification('danger', msg);
        }
      }
    } catch (e) {
      return e;
    }
  };

  const openInvitePopup = (id) => {
    setKey('addmember');
    handleShow();
    setTeamid(id);
    setCreateT(false);
  };
  return (
    <div className="team-sidebar">
      <div className="sidebar-header">
        <img src={teamicon} alt="Friends" /> Teams
      </div>
      {teams && teams.length > 0 ? (
        <>
          <div className="dropsown-list">
            {teams.map((el, i) => {
              return (
                <TeamListDropDown
                  element={el}
                  index={i}
                  openInvitePopup={openInvitePopup}
                  _id={_id}
                />
              );
            })}
          </div>
          <Button onClick={handleShow} className="create-teambtn">
            {t('header.team.create-team')}
          </Button>
        </>
      ) : (
        <React.Fragment>
          <h3> {t('header.team.not-a-team')}</h3>
          <Button onClick={handleShow}> {t('header.team.create-team')}</Button>
        </React.Fragment>
      )}

      <PopupWrapper
        show={show}
        handleClose={handleClose}
        heading={'Create a Team'}
        defaultClass={'outlayed-popup team-popup'}
      >
        <Tabs
          activeKey={key}
          id="uncontrolled-tab-example"
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="createteam" title={t('header.team.create-team')}>
            <CreateTeam
              changeHandler={changeHandler}
              countrylist={countrylist}
              country={country}
              setName={setName}
              setTag={setTag}
              CreateMyTeam={CreateMyTeam}
              imgRef={imgRef}
              renderbutton={renderbutton}
              setShow={setShow}
              show={show}
              setKey={setKey}
              errors={errors}
            />
          </Tab>
          <Tab
            eventKey="addmember"
            title={t('header.team.add-member')}
            disabled={createT}
          >
            <AddMembers
              getProfiles={getProfiles}
              profileList={profiles}
              selectMember={selectMember}
              invitedMember={invitedMember}
              removeMember={removeMember}
              assignCaptain={assignCaptain}
              errors={errors}
              sendInvitation={sendInvitation}
              teamid={teamid}
            />
          </Tab>
        </Tabs>
      </PopupWrapper>
    </div>
  );
};
export default Team;

const CreateTeam = ({
  changeHandler,
  countrylist,
  country,
  setName,
  setTag,
  CreateMyTeam,
  imgRef,
  renderbutton,
  setShow,
  show,
  setKey,
  errors,
}) => {
  const { t } = useTranslation();
  return (
    <div className="create-team">
      <Form onSubmit={CreateMyTeam}>
        <Form.Group controlId="formBasicloginone">
          <Form.Label> {t('header.team.team-name')}: </Form.Label>
          <Form.Control
            type="text"
            placeholder={t('header.team.team-name')}
            name="name"
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
        </Form.Group>

        <Form.Group controlId="formBasicloginone">
          <Form.Label>{t('header.team.team-tag')}: </Form.Label>
          <Form.Control
            type="tex"
            placeholder={t('header.team.team-tag')}
            name="tag"
            autoComplete="off"
            onChange={(e) => setTag(e.target.value)}
          />
          {errors.tag && <span style={{ color: 'red' }}>{errors.tag}</span>}
        </Form.Group>

        <Form.Group controlId="formBasicloginone">
          <Form.Label>{t('header.team.country')}: </Form.Label>
          <div className="profile-menu">
            <Select
              options={countrylist}
              value={country}
              onChange={changeHandler}
            />
          </div>
          {errors.country && (
            <span style={{ color: 'red' }}>{errors.country}</span>
          )}
        </Form.Group>
        <Form.Group controlId="formBasicloginone">
          <div className="upload-image-team">
            <Form.File
              id="exampleFormControlFile1"
              label="Logo:"
              ref={imgRef}
            />
            {errors.image && (
              <span style={{ color: 'red' }}>{errors.image}</span>
            )}
          </div>
          <div className="team-popup-button">
            {renderbutton ? (
              <React.Fragment>
                <Button
                  className="add-member-btn"
                  onClick={() => setKey('addmember')}
                >
                  {t('header.team.add-member')}
                </Button>
                <Button
                  className="add-member-later"
                  onClick={() => setShow(!show)}
                >
                  {t('header.team.add-later')}
                </Button>
              </React.Fragment>
            ) : (
              <Button className="add-member-btn" type="submit">
                {t('header.team.create-team')}
              </Button>
            )}
          </div>
        </Form.Group>
      </Form>
    </div>
  );
};

// const AddMembers = () => {
//     return (
//         <div className="add-member">

//             <Form>
//                 <Form.Group controlId="formBasicloginone">
//                     <Form.Label>Invite link: </Form.Label>
//                     <Form.Control
//                         type="name"
//                         placeholder="Name"
//                         name="name"
//                         autoComplete="off"
//                     />
//                     <Button className="copy-link">Copy</Button>
//                 </Form.Group>

//                 <Form.Group controlId="formBasicloginone">
//                     <Form.Label>Add members: </Form.Label>
//                     <Form.Control
//                         type="name"
//                         placeholder="Search member"
//                         name="name"
//                         autoComplete="off"
//                     />
//                 </Form.Group>

//                 <Form.Group className="invited-players" controlId="formBasicloginone">
//                     <span>Invited Players</span>
//                     <div className="invite-palyer-content">
//                         <div className="invite-palyer-box">
//                             <div className="invite-palyer-img">
//                                 <i className="fa fa-times"></i>
//                                 <img src={user} alt="user" />
//                                 <span>Crismow</span>
//                             </div>
//                         </div>
//                     </div>
//                 </Form.Group>

//                 <div className="team-popup-button">
//                     <Button className="send-invitation">Send Invitation</Button>
//                 </div>

//             </Form>
//         </div>
//     );
// };

const AddMembers = ({
  getProfiles,
  profileList,
  selectMember,
  invitedMember,
  removeMember,
  errors,
  sendInvitation,
  teamid,
  assignCaptain,
}) => {
  const { t } = useTranslation();
  return (
    <div className="add-member">
      <Form>
        <Form.Group controlId="formBasicloginone">
          <Form.Label>{t('header.team.invite-link')}: </Form.Label>
          <Form.Control
            type="text"
            name="name"
            autoComplete="off"
            disabled={true}
            value={`${window.location.origin}/teamdetails/?id=${teamid}`}
          />
          <Button
            className="copy-link"
            onClick={() => {
              copy(`${window.location.origin}/teamdetails/?id=${teamid}`);
              Notification('success', 'Link copied !!');
            }}
          >
            {t('header.team.copy')}
          </Button>
        </Form.Group>
        <Form.Group controlId="formBasicloginone">
          <Form.Label>{t('header.team.add-member')}: </Form.Label>
          <Form.Control
            type="name"
            placeholder="Search member"
            name="name"
            autoComplete="off"
            onChange={getProfiles}
          />
          <Button className="search-member">
            <i className="fa fa-search"></i>
          </Button>
        </Form.Group>

        <Form.Group className="invited-players" controlId="formBasicloginone">
          <span>{t('header.team.selected-player')}</span>
          <div className="invite-palyer-content">
            {invitedMember.length > 0 ? (
              invitedMember.map((el, i) => {
                return (
                  <InvitedMembers
                    element={el}
                    index={i}
                    removeMember={removeMember}
                    assignCaptain={assignCaptain}
                  />
                );
              })
            ) : (
              <span>{t('header.team.no-selected')}</span>
            )}
          </div>
        </Form.Group>
        <div className="team-popup-button">
          <Button
            className="send-invitation"
            onClick={(e) => sendInvitation(e)}
            disabled={invitedMember.length <= 0 ? true : false}
          >
            {t('header.team.send-invitation')}
          </Button>
          {errors.err && <span style={{ color: 'red' }}>{errors.err}</span>}
        </div>
        {profileList.length > 0 && (
          <div className="search-list search-list-team">
            <div className="list">
              {profileList.map((el, i) => {
                return (
                  <ListItem2
                    element={el}
                    index={i}
                    selectMember={selectMember}
                  />
                );
              })}
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};

const TeamListDropDown = ({ element, index, openInvitePopup, _id: userid }) => {
  const { name, joinedmembers, teamlogo, _id, creator } = element;
  return (
    <Dropdown key={index} className="dropdown-team">
      <Dropdown.Toggle
        variant="success"
        id="dropdown-basic"
        className="teamlist-dropdown"
      >
        <img src={teamlogo ? teamlogo : profile} alt="team" />
        <h6>{name}</h6>
        <img src={arrow} alt="arrow" className="arrow" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <div className="team-listsection">
          {joinedmembers &&
            joinedmembers.map((el, i) => {
              return <ListItem element={el} index={i} />;
            })}
        </div>
        <div className="Both-button-sho">
          {userid === creator && (
            <Button
              className="add-in-team"
              onClick={() => openInvitePopup(_id)}
            >
              <i class="fa fa-plus" aria-hidden="true"></i>
            </Button>
          )}
          <Link
            to={`/teamdetails/?id=${_id}`}
            target="_blank"
            className="add-in-team"
          >
            <i class="fa fa-eye" aria-hidden="true"></i>
          </Link>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const ListItem = ({ element, index }) => {
  const { username, useravatar, online } = element;
  return (
    <div className="team-list" key={index}>
      <div className="friend-text">
        <i
          className={`fa fa-circle ${online ? 'green' : 'gray'}`}
          aria-hidden="true"
        ></i>
        <img src={useravatar ? useravatar : profile} alt="friend" />
        <h6>{username}</h6>
      </div>
      <div className="friend-chat">
        <img src={chat} alt="chat" />
      </div>
    </div>
  );
};

const ListItem2 = ({ element, index, selectMember }) => {
  const { username, useravatar } = element;
  return (
    <h6 key={index} onClick={() => selectMember(index)}>
      <img src={useravatar ? useravatar : userIcon} />
      {username}
    </h6>
  );
};

const InvitedMembers = ({ element, index, removeMember, assignCaptain }) => {
  const { _id, username, useravatar, active } = element;
  return (
    <div
      className={
        active ? 'invite-palyer-box activecaptain' : 'invite-palyer-box'
      }
      key={index}
    >
      <div className="invite-palyer-img">
        <i
          class="fa fa-graduation-cap captainicon"
          onClick={() => {
            if (window.confirm('Are you sure to assign captain?')) {
              assignCaptain(_id);
            }
          }}
        ></i>
        <i className="fa fa-times" onClick={() => removeMember(_id)}></i>
        <img src={useravatar ? useravatar : user} alt="user" />
        <span>{username}</span>
      </div>
    </div>
  );
};
