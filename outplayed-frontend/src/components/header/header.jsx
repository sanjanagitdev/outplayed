import React, { useState, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './header.css';
import { NavLink, Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import logo from '../../assets/logo/logo.png';
import logoicon from '../../assets/logo/logo-icon.png';
import search from '../../assets/header/search-icon.png';
import notificationn from '../../assets/header/notification-icon.png';
import cart from '../../assets/header/cart-icon.png';
import money from '../../assets/header/money-icon.png';
import user from '../../assets/header/user-icon.png';
import Dropdown from 'react-bootstrap/Dropdown';
import UserContext from '../../context/context';
import { userInstance } from '../../config/axios';
import { LoginPopup, RegistrationPopup } from '../popups/login-register';
import { ForgetPopup } from '../popups/forget';
import { ResetPopup } from '../popups/reset';
import {
  queryString,
  Notification,
  SuportValidation,
  handlePersonalDetails,
} from '../../function/index';
import { socket, ScoutingAriaChat } from '../../socket';
import NotificationPage from '../notification/notification';
import PopupWrapper from '../popups/popupwrapper';
import Wallet from '../popups/wallet';
import SectionIncidents from '../sectionincident/sectionincident';
import IncidentList from '../sectionincident/incidentList';
const Header = () => {
  const { loggedIn, setIsLogin, userDetails, setUserDetails, setGlobalLoader } =
    useContext(UserContext);
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  const {
    username,
    _id: userid,
    useravatar,
    coins,
    notification: notificationData,
    unseen,
    onsiteWallet,
    transactions,
    paypalAccount,
  } = userDetails;
  const [show, setShow] = useState(false);
  const [view, setView] = useState(false);
  const [foregt, setForget] = useState(false);
  const [reset, setReset] = useState(false);
  const [notification, setNotification] = useState(false);
  const [contact, setContact] = useState(false);
  const [incident, setIncident] = useState(false);
  const [incidentList, setIncidentList] = useState(false);
  const [messageData, setMessageData] = useState({
    messageto: '',
    message: '',
    scoutingId: '',
    roomId: '',
  });
  const [scoutingAreaMsg, setScoutingAreaMsg] = useState([]);
  const [wallet, setWallet] = useState(false);
  const initialState = {
    subject: '',
    description: '',
    category: '',
  };
  const initialStateForWithdraw = {
    firstname: '',
    lastname: '',
    dob: '',
    street: '',
    zipcodeCity: '',
    country: null,
    currency: 'EUR',
    phone: '',
  };

  const [supportState, setSupportState] = useState(initialState);
  const [image, setImage] = useState([]);
  const [previewImage, setPreviewImage] = useState([]);
  const [errors, setErrors] = useState({});

  const [step, setStep] = useState(0);
  const [deposit, setDeposit] = useState(false);
  const [withdraw, setWithdraw] = useState(false);
  const [transaction, setTransaction] = useState(false);
  const [amount, setAmount] = useState(0);
  const [withdrawState, setWithdrawState] = useState(initialStateForWithdraw);

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setNotification(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  };
  const wrapperRef = useRef(null);

  useOutsideAlerter(wrapperRef);

  const handleshownotify = () => {
    try {
      setNotification(!notification);
      if (unseen.length > 0) {
        ReadAllNotification();
      }
    } catch (error) {
      return error;
    }
  };
  const showIncident = () => {
    setIncident(!incident);
  };
  const showIncidentList = () => {
    setIncidentList(!incidentList);
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleViewClose = () => setView(false);
  const handleViewShow = () => setView(true);
  const handleShowForget = () => {
    setForget(true);
    setShow(false);
  };
  const handleCloseForget = () => setForget(false);
  useEffect(() => {
    const { forgethash } = queryString();
    if (forgethash) {
      setReset(true);
    }
    ScoutingAriaChat((data) => {
      console.log(data);
    });
  }, []);

  const acceptRequest = async (e, _id) => {
    try {
      e.preventDefault();
      const response = await userInstance().post(`/acceptRequest`, { _id });
      const {
        data: { code, msg },
      } = response;
      if (code === 200) {
        Notification('success', msg);
      } else {
        Notification('danger', msg);
      }
    } catch (error) {
      return;
    }
  };

  const rejectRequest = async (e, _id) => {
    try {
      e.preventDefault();
      const response = await userInstance().post(`/rejectRequest`, { _id });
      const {
        data: { code, msg },
      } = response;
      if (code === 200) {
        Notification('success', msg);
      } else {
        Notification('danger', msg);
      }
    } catch (error) {
      return;
    }
  };
  const joinGroup = async (notifyid) => {
    try {
      const response = await userInstance().post('/joingroup', { notifyid });
      const {
        data: { code, msg, errors },
      } = response;
      if (code === 200) {
      } else if (code === 201) {
        Notification('danger', Object.values(errors)[0]);
      } else {
        Notification('danger', msg);
      }
    } catch (error) {
      return;
    }
  };
  const joinTeam = async (notifyid) => {
    try {
      const response = await userInstance().post('/jointeam', { notifyid });
      const {
        data: { code, msg, errors },
      } = response;
      if (code === 200) {
      } else if (code === 201) {
        Notification('danger', Object.values(errors)[0]);
      } else {
        Notification('danger', msg);
      }
    } catch (error) {
      return;
    }
  };
  const ReadAllNotification = async () => {
    try {
      const response = await userInstance().get('/markasread');
      const {
        data: { code },
      } = response;
      if (code === 200) {
        setUserDetails({ ...userDetails, unseen: [] });
      }
    } catch (error) {
      return;
    }
  };

  const handleContactOpenClose = async (type, values) => {
    if (type === 'open') {
      const { scoutingId, roomId } = values ? values : {};
      const response = await userInstance().get(
        `/GetScoutingAreaNotifyMsg/${scoutingId}/${roomId}`
      );
      const {
        data: { code, getDataForChat, msg },
      } = response;
      if (code === 200) {
        if (getDataForChat.length > 0) {
          const { messages } = getDataForChat[0];
          setScoutingAreaMsg(messages);
          setContact(!contact);
          setMessageData({ ...messageData, scoutingId, roomId });
          socket.emit('join', roomId);
        }
      } else {
        Notification('danger', msg);
      }
    }
  };

  const setMessage = (e) => {
    const { value } = e.target;
    setMessageData({ ...messageData, message: value });
  };

  const sendMessage = () => {
    try {
      const { message, roomId, scoutingId } = messageData;
      if (message.trim() && roomId && scoutingId) {
        const token = localStorage.getItem('webtoken');
        const messageData = { token, message, roomId, scoutingId };
        socket.emit('ScoutingAriaChat', messageData);
      }
    } catch (error) {
      return error;
    }
  };

  const showWalllet = (type) => {
    if (type === 'deposit') {
      setDeposit(true);
      setWithdraw(false);
      setTransaction(false);
      setWallet(true);
    } else if (type === 'withdraw') {
      setDeposit(false);
      setWithdraw(true);
      setTransaction(false);
      setWallet(true);
    } else if (type === 'transaction') {
      setDeposit(false);
      setWithdraw(false);
      setTransaction(true);
      setWallet(true);
    } else {
      setWallet(!wallet);
    }
  };

  //Support ticket incident code start here -
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupportState({ ...supportState, [name]: value });
  };

  const imageSelect = (e) => {
    try {
      setImage(e);
      let objectUrl = [];
      for (let i = 0; i < e.length; i++) {
        objectUrl.push({ url: URL.createObjectURL(e[i]), name: e[i].name });
      }
      setPreviewImage(objectUrl);
    } catch (error) {
      return error;
    }
  };

  const CreateTicket = async (e) => {
    try {
      e.preventDefault();
      const { isValid, errors } = SuportValidation(supportState, image);
      if (!isValid) {
        setErrors(errors);
        return;
      }
      const data = new FormData();
      for (let i = 0; i < image.length; i++) {
        data.append('file', image[i]);
      }
      setGlobalLoader(true);
      const response = await userInstance().post('/postticket', data, {
        params: supportState,
      });
      const {
        data: { code, msg, supportTicket },
      } = response;
      if (code === 200) {
        Notification('success', msg);
        let { postedtickets } = userDetails;
        postedtickets = postedtickets ? postedtickets : [];
        postedtickets.unshift(supportTicket);
        setUserDetails({ ...userDetails, postedtickets: postedtickets });
        setSupportState(initialState);
        setGlobalLoader(false);
        showIncident();
      } else {
        setGlobalLoader(false);
        Notification('danger', msg);
      }
    } catch (error) {
      return error;
    }
  };

  const HandleDeposit = async () => {
    try {
      console.log('amount data =>>', amount);
      if (!amount) {
        Notification('danger', 'Please add amount for deposit');
        return;
      }
      setGlobalLoader(true);
      const response = await userInstance().post('/deposit', { amount });
      const {
        data: { code, url },
      } = response;
      if (code === 200) {
        setGlobalLoader(false);
        window.location.href = url;
      } else {
        setGlobalLoader(false);
      }
    } catch (error) {
      return error;
    }
  };

  // Code for withdraw request
  const HandleChangeForWithdraw = (e) => {
    const { name, value } = e.target;
    setWithdrawState({ ...withdrawState, [name]: value });
  };

  const handlePresnoalDetailsData = () => {
    const { isValid, errors } = handlePersonalDetails(withdrawState);
    if (!isValid) {
      setErrors(errors);
      return;
    }
    setStep((pre) => pre + 1);
  };

  const SubmitWithdrawRequest = async () => {
    try {
      setGlobalLoader(true);
      const response = await userInstance().post('/createWithdrawRequest', {
        data: withdrawState,
        amount,
      });
      const {
        data: { code, msg },
      } = response;
      if (code === 200) {
        Notification('success', msg);
        setGlobalLoader(false);
      } else {
        Notification('danger', msg);
        setGlobalLoader(false);
      }
    } catch (error) {
      return error;
    }
  };

  const props = {
    setStep,
    HandleDeposit,
    setAmount,
    amount,
    onsiteWallet,
    HandleChangeForWithdraw,
    withdraw,
    withdrawState,
    handlePresnoalDetailsData,
    SubmitWithdrawRequest,
    errors,
    transactions,
    paypalAccount,
  };

  return (
    <>
      <div className="header">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>

        {loggedIn ? (
          <div className="logged-in-header">
            <div className="header-action">
              <ul>
                <li>
                  <Link>
                    <img src={search} alt="Search" />
                  </Link>
                </li>
                <li>
                  <span onClick={() => handleshownotify()}>
                    <img src={notificationn} alt="Notification" />
                    {unseen && unseen.length > 0 && (
                      <span className="countt">{unseen.length}</span>
                    )}
                  </span>
                </li>
                <li>
                  <Link>
                    <img src={cart} alt="Cart" />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="wallet">
              <span>{coins ? coins : 0}</span>
              <img src={money} alt="money" />
            </div>
            <div
              className="wallet-amount"
              onClick={() => showWalllet('deposit')}
              role="presentation"
            >
              <i class="fa fa-money" aria-hidden="true"></i>
            </div>
            <div className="profile-menu">
              <img src={useravatar ? useravatar : user} alt="user" />
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {username}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Link to={`/profile/?id=${userid}`}>
                    {t('header.my-profile')}
                  </Link>
                  <div
                    className="tickets"
                    role="presentation"
                    onClick={showIncidentList}
                  >
                    {t('header.tickets')}
                  </div>
                  <Link
                    to="/"
                    onClick={() => {
                      localStorage.removeItem('webtoken');
                      localStorage.removeItem('userid');
                      window.location.href = '/';
                    }}
                  >
                    {t('header.logout')}
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        ) : (
          <Nav>
            <button className="nav-link" onClick={handleShow}>
              {t('header.login')}
            </button>
            <NavLink className="nav-link logo-icon" to="/">
              <img src={logoicon} alt="logicon" />
            </NavLink>
            <button className="nav-link" onClick={handleViewShow}>
              {t('header.register')}
            </button>
          </Nav>
        )}
        <div className="language-btn">
          <Dropdown>
            <Dropdown.Toggle variant="default" id="dropdown-basic">
              {localStorage.getItem('i18nextLng') === 'es' ? 'es' : 'en'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => changeLanguage('es')}>
                ES
              </Dropdown.Item>
              <Dropdown.Item onClick={() => changeLanguage('en')}>
                EN
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {show && (
          <LoginPopup
            show={show}
            handleClose={handleClose}
            setIsLogin={setIsLogin}
            handleShowForget={handleShowForget}
          />
        )}
        {view && (
          <RegistrationPopup view={view} handleViewClose={handleViewClose} />
        )}
        {foregt && (
          <ForgetPopup show={foregt} handleClose={handleCloseForget} />
        )}
        {reset && (
          <ResetPopup show={reset} handleClose={() => setReset(!reset)} />
        )}
        {notification && (
          <NotificationPage
            handleshownotify={handleshownotify}
            notificationData={notificationData}
            acceptRequest={acceptRequest}
            rejectRequest={rejectRequest}
            joinGroup={joinGroup}
            joinTeam={joinTeam}
            wrapperRef={wrapperRef}
            handleContactOpenClose={handleContactOpenClose}
          />
        )}
        {wallet && (
          <Wallet
            wallet={wallet}
            showWalllet={showWalllet}
            deposit={deposit}
            withdraw={withdraw}
            transaction={transaction}
            step={step}
            props={props}
          />
        )}
        {incident && (
          <SectionIncidents
            showIncident={showIncident}
            incident={incident}
            handleChange={handleChange}
            supportState={supportState}
            imageSelect={imageSelect}
            CreateTicket={CreateTicket}
            errors={errors}
            previewImage={previewImage}
          />
        )}
        {incidentList && (
          <IncidentList
            incidentList={incidentList}
            showIncidentList={showIncidentList}
            showIncident={showIncident}
          />
        )}
        {contact && (
          <ContactPopup
            show={contact}
            handleClose={handleContactOpenClose}
            setMessage={setMessage}
            sendMessage={sendMessage}
            scoutingAreaMsg={scoutingAreaMsg}
          />
        )}
      </div>
    </>
  );
};
export default Header;

//This popup is used for reply on sco
const ContactPopup = ({
  show,
  handleClose,
  setMessage,
  sendMessage,
  scoutingAreaMsg,
}) => {
  return (
    <PopupWrapper
      show={show}
      handleClose={handleClose}
      defaultClass={'contact-popup'}
    >
      <div className="contact-box-popup">
        <div className="chat-section">
          <div className="closing-icon">
            <i
              className="fa fa-times"
              aria-hidden="true"
              onClick={handleClose}
            />
          </div>
          <div className="chat-content">
            <h2>Contact</h2>
            <div className="chat-box">
              <div className="chat-view custom-scroll">
                {scoutingAreaMsg &&
                  scoutingAreaMsg.map((el, i) => {
                    return <MsgItem element={el} index={i} />;
                  })}
              </div>
              <input
                type="text"
                placeholder="write your message here..."
                onChange={setMessage}
              />
            </div>
            <div className="send-button">
              <button type="submit" onClick={sendMessage}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </PopupWrapper>
  );
};

const MsgItem = ({ element, index }) => {
  const {
    sendby: { useravatar, _id },
    message,
  } = element;
  return (
    <div
      className={`contact-message ${
        _id === localStorage.getItem('userid') && 'user-chat'
      }`}
      key={index}
    >
      <h6>
        <img src={useravatar ? useravatar : user} alt="user" />
        {message}
      </h6>
    </div>
  );
};
