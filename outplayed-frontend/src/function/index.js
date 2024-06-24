import { store } from 'react-notifications-component';
import Prestige1 from '../assets/prestigios/Prestigio I_Mesa de trabajo 1.png';
import Prestige2 from '../assets/prestigios/Prestigio II_Mesa de trabajo 1.png';
import Prestige3 from '../assets/prestigios/Prestigio III_Mesa de trabajo 1.png';
import Prestige4 from '../assets/prestigios/Prestigio IV_Mesa de trabajo 1.png';
import Prestige5 from '../assets/prestigios/Prestigio IX_Mesa de trabajo 1.png';
import Prestige6 from '../assets/prestigios/Prestigio V_Mesa de trabajo 1.png';
import Prestige7 from '../assets/prestigios/Prestigio VI_Mesa de trabajo 1.png';
import Prestige8 from '../assets/prestigios/Prestigio VII_Mesa de trabajo 1.png';
import Prestige9 from '../assets/prestigios/Prestigio VIII_Mesa de trabajo 1.png';
import Prestige10 from '../assets/prestigios/Prestigio X_Mesa de trabajo 1.png';

export const Notification = (type, message) => {
  store.addNotification({
    title: 'Notification',
    message: message,
    type: type,
    insert: 'top',
    container: 'top-right',
    animationIn: ['animated', 'fadeIn'],
    animationOut: ['animated', 'fadeOut'],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
};

export const queryString = () => {
  let query = window.location.search.substr(1);
  let resultval = {};
  query.split('&').forEach(function (part) {
    let item = part.split('=');
    resultval[item[0]] = decodeURIComponent(item[1]);
  });
  return resultval;
};

export const checkIfEmpty = (requestBody) => {
  const values = Object.values(requestBody);
  let isEmpty = values.filter((el) => (el ? !el.trim() : !el));
  return {
    isValid: isEmpty.length > 0 ? false : true,
  };
};

export const getTimeFormate = (date) => {
  let seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + ' years';
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + ' months';
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + ' days';
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + ' hours';
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + ' minutes';
  }
  return Math.floor(seconds) + ' seconds';
};

export const validateLogin = (values) => {
  let loginerrors = {};
  let isValid = true;
  const EmailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!values.email) {
    loginerrors.email = 'Email is required';
    isValid = false;
  } else if (!EmailRegex.test(values.email)) {
    loginerrors.email = 'Email address is invalid';
    isValid = false;
  }
  if (!values.password.trim()) {
    loginerrors.password = 'Password is required';
    isValid = false;
  } else if (values.password.length < 5) {
    loginerrors.password = 'Please Enter a valid Password';
    isValid = false;
  } else if (values.password.length > 15) {
    loginerrors.password = 'Please Enter a valid Password';
    isValid = false;
  }
  return { isValid: isValid, loginerrors: loginerrors };
};
export const validateRegister = (values) => {
  let errors = {};
  let isValid = true;
  const EmailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  if (!values.username.trim()) {
    errors.username = 'Username is required';
    isValid = false;
  } else if (values.username.length < 5) {
    errors.username = 'Username should be greater than 5 characters';
    isValid = false;
  } else if (values.username.length > 15) {
    errors.username = 'Username should be less than 15 characters';
    isValid = false;
  }
  if (!values.email) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (
    !isNaN(values.email.trim() ? values.email.split('@')[0] : null) &&
    !isNaN(
      values.email.trim() ? values.email.split('@')[1].split('.')[0] : null
    )
  ) {
    errors.email = 'Please enter a valid email';
    isValid = false;
  } else if (!EmailRegex.test(values.email)) {
    errors.email = 'Please enter a valid email';
    isValid = false;
  }
  if (!values.password) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (!passwordRegex.test(values.password)) {
    errors.password =
      'The password must be at least 8 characters long, and you must use at least one uppercase and one number and one special charecter';
    isValid = false;
  }
  if (!values.repeatPassword.trim()) {
    errors.repeatPassword = 'Confirm password is required';
    isValid = false;
  } else if (values.password !== values.repeatPassword) {
    errors.repeatPassword = 'Confirm password does not match';
    isValid = false;
  }
  if (!values.isChecked) {
    errors.isChecked = 'Please accept terms & conditions';
    isValid = false;
  }
  return { isValid: isValid, errors: errors };
};

export const showRedIcon = (likes, userid) => {
  const filterUserLikes = likes.filter((el) => el === userid && userid);
  if (filterUserLikes.length > 0) {
    return true;
  } else {
    return false;
  }
};

export const validateComment = (values) => {
  let errors = {};
  let isValid = true;
  if (!values.comment.trim()) {
    errors.comment = 'comment is required';
    isValid = false;
  } else if (values.comment.length > 2500) {
    errors.comment =
      "You can't able to post a comment with more than 350 words !";
    isValid = false;
  }
  return { isValid: isValid, errors: errors };
};

export const validateNormalHub = (values) => {
  let errors = {};
  let isValid = true;
  if (!values.name.trim()) {
    errors.name = 'Name is required';
    isValid = false;
  } else if (values.name.length > 20) {
    errors.name = 'Please put less than 20 charecters name';
    isValid = false;
  }
  if (values.prestige === 'Please select prestige') {
    errors.prestige = 'Please select prestige';
    isValid = false;
  }
  return { isValid: isValid, errors: errors };
};

export const setRemember = (email, password, checked) => {
  localStorage.setItem('email', email);
  localStorage.setItem('password', password);
  localStorage.setItem('isChecekd', checked);
};
export const clearRemember = () => {
  localStorage.removeItem('email');
  localStorage.removeItem('password');
  localStorage.removeItem('isChecekd');
};
export const getRemember = () => {
  let email = localStorage.getItem('email');
  let password = localStorage.getItem('password');
  let checked = localStorage.getItem('isChecekd');
  if (email && checked && password) {
    return { email, password, checked };
  } else {
    return false;
  }
};

export const validateReset = (values) => {
  let errors = {};
  let isValid = true;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  if (!values.password.replace(/ /g, '')) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (!passwordRegex.test(values.password)) {
    errors.password =
      'The password must be at least 8 characters long, and you must use at least one uppercase and one number and one special charecter';
    isValid = false;
  }
  if (!values.repeatPassword) {
    errors.repeatPassword = 'Confirm password is required';
    isValid = false;
  } else if (values.password !== values.repeatPassword) {
    errors.repeatPassword = 'Confirm password does not match';
    isValid = false;
  }
  return { isValid: isValid, errors: errors };
};

export const validateForget = (values) => {
  let errors = {};
  let isValid = true;
  const EmailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!values.email.replace(/ /g, '')) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (
    !isNaN(values.email.trim() ? values.email.split('@')[0] : null) &&
    !isNaN(
      values.email.trim() ? values.email.split('@')[1].split('.')[0] : null
    )
  ) {
    errors.email = 'Invalid Email';
    isValid = false;
  } else if (!EmailRegex.test(values.email)) {
    errors.email = 'Invalid Email';
    isValid = false;
  }
  return { isValid: isValid, errors: errors };
};
export const validateHubsCreate = (values) => {
  let errors = {};
  let isValid = true;
  if (!values.prestige.trim()) {
    errors.prestige = 'Please select a prestige';
    isValid = false;
  } else if (values.prestige === 'Choose prestige') {
    errors.prestige = 'Please select a prestige';
    isValid = false;
  }
  return { isValid: isValid, errors: errors };
};

export const prestige = (prestige) => {
  const Object = {
    'Prestige 1': Prestige1,
    'Prestige 2': Prestige2,
    'Prestige 3': Prestige3,
    'Prestige 4': Prestige4,
    'Prestige 5': Prestige5,
    'Prestige 6': Prestige6,
    'Prestige 7': Prestige7,
    'Prestige 8': Prestige8,
    'Prestige 9': Prestige9,
    'Prestige 10': Prestige10,
  };
  return Object[prestige];
};

export const validateHubsSearch = (values) => {
  let errors = {};
  let isValid = true;
  if (!values.name.trim()) {
    errors.name = 'Hub name is required';
    isValid = false;
  } else if (values.name.length > 30) {
    errors.name = 'please enter valid string';
    isValid = false;
  }
  if (!values.prestige.trim()) {
    errors.prestige = 'Please select a prestige';
    isValid = false;
  } else if (values.prestige === 'Choose prestige') {
    errors.prestige = 'Please select a prestige';
    isValid = false;
  }
  return { isValid: isValid, errors: errors };
};

export const GetPrestigeAccPoint = (elo) => {
  let prestiges = '';
  if (elo < 1200) {
    prestiges = 'Prestige 1';
  } else if (elo >= 1200 && elo < 1400) {
    prestiges = 'Prestige 2';
  } else if (elo >= 1400 && elo < 1600) {
    prestiges = 'Prestige 3';
  } else if (elo >= 1600 && elo < 1800) {
    prestiges = 'Prestige 4';
  } else if (elo >= 1800 && elo < 2000) {
    prestiges = 'Prestige 5';
  } else if (elo >= 2000 && elo < 2300) {
    prestiges = 'Prestige 6';
  } else if (elo >= 2300 && elo < 2600) {
    prestiges = 'Prestige 7';
  } else if (elo >= 2600 && elo < 2900) {
    prestiges = 'Prestige 8';
  } else if (elo >= 2900 && elo < 3500) {
    prestiges = 'Prestige 9';
  } else {
    prestiges = 'Prestige 10';
  }
  return prestige(prestiges);
};

export const GetNextPrestige = (elo) => {
  let prestiges = 0;
  if (elo < 1200) {
    prestiges = 1200;
  } else if (elo >= 1200 && elo < 1400) {
    prestiges = 1400;
  } else if (elo >= 1400 && elo < 1600) {
    prestiges = 1600;
  } else if (elo >= 1600 && elo < 1800) {
    prestiges = 1800;
  } else if (elo >= 1800 && elo < 2000) {
    prestiges = 2000;
  } else if (elo >= 2000 && elo < 2300) {
    prestiges = 2300;
  } else if (elo >= 2300 && elo < 2600) {
    prestiges = 2600;
  } else if (elo >= 2600 && elo < 2900) {
    prestiges = 2900;
  } else if (elo >= 2900 && elo < 3500) {
    prestiges = 3500;
  } else {
    prestiges = 3500;
  }
  return prestiges;
};
export const AmPm = (time) => {
  time = new Date(time);
  return time.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

export const FormatTimer = (time) => {
  let seconds = time % 60;
  let minutes = Math.floor(time / 60);
  minutes = minutes.toString().length === 1 ? '0' + minutes : minutes;
  seconds = seconds.toString().length === 1 ? '0' + seconds : seconds;
  return minutes + ':' + seconds;
};

export const validateTeamCreation = (values) => {
  let errors = {};
  let isValid = true;
  if (!values.name.trim()) {
    errors.name = 'team name is required';
    isValid = false;
  } else if (values.name.length > 20) {
    errors.name = 'team name required less than 20 chars';
    isValid = false;
  }
  if (!values.tag.trim()) {
    errors.tag = 'Tag is required';
    isValid = false;
  } else if (values.tag.length > 20) {
    errors.tag = 'tag required less than 20 chars';
    isValid = false;
  }
  if (!values.country) {
    errors.country = 'Plesae select a country';
    isValid = false;
  }
  if (values.checkValid) {
    const checkValue = values.checkValid[1];
    if (checkValue === 'png' || checkValue === 'jpg' || checkValue === 'jpeg') {
      //no comment
    } else {
      errors.image = 'Please select png or jpg or jpeg type file';
      isValid = false;
    }
  }
  return { isValid: isValid, errors: errors };
};

export const MovePosition = (arr, old_index, new_index) => {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
};

export const EncodeData = (salt) => {
  const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
  const byteHex = (n) => ('0' + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);

  return (text) =>
    text.split('').map(textToChars).map(applySaltToChar).map(byteHex).join('');
};

export const DecodeData = (salt) => {
  const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);
  return (encoded) =>
    encoded
      .match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join('');
};

export const checkPlayersStatus = (joinedmembers) => {
  let errors = {};
  let isValid = true;
  const checkOfflinePeople = joinedmembers.filter((el) => !el.online);
  if (joinedmembers.length < 5) {
    isValid = false;
    errors.playerslength =
      'Please add atleast 5 players in the team and then play !!';
  }
  // if (checkOfflinePeople.length > 0) {
  //     isValid = false;
  //     errors.offline = "Some team members are offline";
  // }
  return { isValid, errors };
};

export const CalculateStats = (team1, team2, gamemode) => {
  try {
    let setForStats = [];

    const players = [...team1, ...team2];
    players.forEach((el, i) => {
      const {
        userid: { prestige, username, useravatar },
        iscaptain,
      } = el;
      //Here we change chekFrom 1 to 4 when 5vs5 need to add;
      let checkFrom = gamemode === '1vs1' ? 0 : 1;
      let type = i <= checkFrom ? 'team1' : 'team2';
      if (el.result) {
        const {
          kills,
          deaths,
          head_shots,
          assists,
          result,
          t_overall_score,
          ct_overall_score,
        } = el.result;
        if (result === 'win') {
          const score =
            ct_overall_score > t_overall_score
              ? ct_overall_score
              : t_overall_score;
          let headshot_per = (head_shots * 100) / kills;
          headshot_per = isFinite(headshot_per) ? headshot_per.toFixed(2) : 0.0;
          let dvalue = deaths > 0 ? deaths : 1;
          let kdr = kills / dvalue;
          kdr = isFinite(kdr) ? kdr.toFixed(2) : 0.0;
          setForStats.push({
            score,
            kdr,
            headshot_per,
            kills,
            assists,
            deaths,
            prestige,
            username,
            useravatar,
            iscaptain,
            type,
          });
        } else if (result === 'loss') {
          const score =
            ct_overall_score > t_overall_score
              ? t_overall_score
              : ct_overall_score;
          let headshot_per = (head_shots * 100) / kills;
          headshot_per = isFinite(headshot_per) ? headshot_per.toFixed(2) : 0.0;
          let dvalue = deaths > 0 ? deaths : 1;
          let kdr = kills / dvalue;
          kdr = isFinite(kdr) ? kdr.toFixed(2) : 0.0;
          setForStats.push({
            score,
            kdr,
            headshot_per,
            kills,
            assists,
            deaths,
            prestige,
            username,
            useravatar,
            iscaptain,
            type,
          });
        }
      } else {
        setForStats.push({
          score: 0,
          kdr: 0.0,
          headshot_per: 0.0,
          kills: 0,
          assists: 0,
          deaths: 0,
          prestige,
          username,
          useravatar,
          iscaptain,
          type,
        });
      }
    });
    const calculateMvpAll = setForStats.sort((a, b) => {
      return b.kdr - a.kdr;
    });
    return calculateMvpAll;
  } catch (error) {
    return [];
  }
  // setUserStats(calculateMvpAll);
  // let firstteam = calculateMvpAll.filter(el => el.type === 'team1' && el.iscaptain);
  // let secondteam = calculateMvpAll.filter(el => el.type === 'team2' && el.iscaptain);
  // if (firstteam.length && secondteam.length) {
  //     setBothState({ team1: firstteam[0].score, team2: secondteam[0].score });
  // }
};

export const getTimestamp = (id) => {
  return new Date(parseInt(id.toString().slice(0, 8), 16) * 1000);
};

export const ValidateMap = (values, imageRef) => {
  let errors = {};
  let isValid = true;
  let checkValid = imageRef.current.files[0]
    ? imageRef.current.files[0].type.split('/')
    : false;

  const { title, gametype, mapid } = values;
  if (!title.trim()) {
    errors.title = 'map name is required';
    isValid = false;
  }
  if (gametype) {
    if (!mapid.trim()) {
      errors.mapid = 'Map id required !!';
      isValid = false;
    }
  }
  if (checkValid) {
    const checkValue = checkValid[1];
    if (checkValue === 'png' || checkValue === 'jpg' || checkValue === 'jpeg') {
      //Here return true
    } else {
      errors.imgurl = 'Please select png jpg jpeg format';
      isValid = false;
    }
  } else {
    errors.imgurl = 'Map image required';
    isValid = false;
  }
  return { isValid, errors };
};

export const validateTournamentCreation = (values, bannerimg) => {
  try {
    let errors = {};
    let isValid = true;
    let checkMax = [4, 8, 16, 32, 64];
    const {
      title,
      tournamentPrize,
      playerNumbers,
      tournamentStart,
      gameType,
      tournamentType,
    } = values;
    const hours = Math.abs(new Date(tournamentStart) - new Date()) / 36e5;
    const checkValid = bannerimg ? bannerimg.type.split('/') : false;
    if (!title.trim()) {
      isValid = false;
      errors.title = 'Tournament title is required !!';
    } else if (title.length > 30) {
      isValid = false;
      errors.title = 'Tournament title is to long !!';
    }
    if (!tournamentPrize) {
      isValid = false;
      errors.tournamentPrize = 'Tournament prize required';
    } else if (tournamentPrize <= 0) {
      isValid = false;
      errors.tournamentPrize = 'Please enter valid tournament prize !!';
    } else if (tournamentPrize > 100000000000000) {
      isValid = false;
      errors.tournamentPrize = 'Please enter valid tournament prize !!';
    }
    if (!playerNumbers) {
      isValid = false;
      errors.playerNumbers = 'Players length required !!';
    } else if (!checkMax.includes(Number(playerNumbers))) {
      isValid = false;
      errors.playerNumbers = 'Invalid players length !!';
    }
    if (!tournamentStart) {
      isValid = false;
      errors.tournamentStart = 'Tournament start date required !!';
    }
    //  else if (hours < 5) {
    //     isValid = false;
    //     errors.tournamentStart = "Atleast 5 hours diffrence from current date !!";
    // }
    if (!gameType) {
      isValid = false;
      errors.gameType = 'Please select a game type !!';
    }
    if (!tournamentType) {
      isValid = false;
      errors.tournamentType = 'Please select tournament type !!';
    }
    if (checkValid) {
      const checkValue = checkValid[1];
      if (
        checkValue === 'png' ||
        checkValue === 'jpg' ||
        checkValue === 'jpeg'
      ) {
        //Here return true
        if (bannerimg.size > 5000000) {
          errors.imgurl = 'Please select image less than 5 mb !!';
          isValid = false;
        }
      } else {
        errors.imgurl = 'Please select png jpg jpeg format';
        isValid = false;
      }
    }
    return { isValid, errors };
  } catch (error) {
    return { isValid: false, errors: { unexpected: 'Unexpected errors !!' } };
  }
};

export const TournamentRuleValidation = (values) => {
  try {
    let isValid = true;
    let errors = {};
    const { tournamentRule } = values;
    if (!tournamentRule.trim()) {
      isValid = false;
      errors.rule = 'Tournament rule is required !!';
    } else if (tournamentRule.length > 5000) {
      isValid = false;
      errors.rule = 'Tournament rule is to long !!';
    }
    return { isValid, errors };
  } catch (error) {
    return { isValid: false, errors: { unexpected: 'Unexpected errors !!' } };
  }
};

export const LessFive = (startDate) => {
  const dates = new Date(startDate).setMinutes(
    new Date(startDate).getMinutes() - 5
  );
};

export const GetCheckIn = (checkedPlayers, Players) => {
  Players.forEach((el) => {
    const isCheck = checkedPlayers.filter((element) => element._id === el._id);
    if (isCheck.length > 0) {
      const { checkedAt } = isCheck[0];
      el.isClass =
        new Date(checkedAt).toLocaleDateString().toString() ===
        new Date().toLocaleDateString().toString()
          ? 'bg-green'
          : '';
      el.isCheck = true;
    } else {
      el.isCheck = false;
      el.isClass = 'bg-red';
    }
  });
  return Players;
};

export const GetWinnerTWinnerPanelData = (winnerObject) => {
  try {
    const { team1, team2 } = winnerObject ? winnerObject : {};
    const winner = [team1, team2].filter((el) => el.result.result === 'win')[0];
    const {
      userid: { username, useravatar, prestige, prestige1vs1 },
      jointype,
    } = winner;
    return {
      useravatar,
      username,
      prestige: jointype === 'tournament1vs1' ? prestige1vs1 : prestige,
    };
  } catch (error) {
    return {};
  }
};

export const GetNormalStatsData1vs1 = (statsData) => {
  try {
    //In this function we calculated 1vs1 stats data-
    let play = statsData.map((el) => el.result);
    let loss = play.filter((el) => el.result === 'loss');
    let win = play.filter((el) => el.result === 'win');
    let draw = play.filter((el) => el.result === 'draw');

    //Calculated longest winning streaks
    let streaks = play
      .map((el) => (el && el.result === 'win' ? 1 : 0))
      .reduce((res, n) => (n ? res[res.length - 1]++ : res.push(0), res), [0]);

    streaks = Math.max(...streaks);

    //Here we calculated kill, deaths kill detah ratio
    let kills = play.reduce((a, { kills }) => a + kills, 0);
    let death = play.reduce((a, { deaths }) => a + deaths, 0);
    let KDR = kills / death;
    KDR = isFinite(KDR) ? parseFloat(KDR.toFixed(2)) : 0;

    //Here we calculated headshots and headshots percentage
    let headshot = play.reduce((a, { headshots }) => a + headshots, 0);
    let headshot_per = (headshot * 100) / kills;
    headshot_per = isFinite(headshot_per)
      ? parseFloat(headshot_per.toFixed(2))
      : 0;

    //here we calculating kills per rounds
    let rounds = play.reduce((a, { rounds }) => a + rounds, 0);
    let KR = kills / rounds;
    KR = isFinite(KR) ? parseFloat(KR.toFixed(2)) : 0;

    // In this line we are calculated the winning percentage in the
    let winpercent =
      (parseFloat(win.length + 0.5 * draw.length) / play.length) * 100;
    winpercent = isFinite(winpercent) ? parseFloat(winpercent.toFixed(2)) : 0;
    const calculatedStats = [
      { loss: loss.length, class: 'no' },
      { win: win.length, class: 'no' },
      { draw: draw.length, class: 'no' },
      { kills, class: 'no' },
      { death, class: 'no' },
      { KDR, class: 'no' },
      { headshot_per, class: 'no' },
      { KR, class: 'no' },
      { winpercent, class: 'no' },
      { totalgames: play.length, class: 'no' },
      { streaks: streaks, class: 'no' },
    ];
    return calculatedStats;
  } catch (error) {
    return {};
  }
};

export const GetNormalStatsData5vs5 = (statsData) => {
  try {
    //In this function we calculated 5vs5 stats data-
    let play = statsData.map((el) => el.result);
    let loss = play.filter((el) => el.result === 'loss');
    let win = play.filter((el) => el.result === 'win');
    let draw = play.filter((el) => el.result === 'draw');
    //Calculate longest winning streaks
    let streaks = play
      .map((el) => (el.result === 'win' ? 1 : 0))
      .reduce((res, n) => (n ? res[res.length - 1]++ : res.push(0), res), [0]);
    streaks = Math.max(...streaks);
    //Here we calculated kill, deaths kill detah ratio
    let kills = play.reduce((a, { kills }) => a + kills, 0);
    let death = play.reduce((a, { deaths }) => a + deaths, 0);
    let assists = play.reduce((a, { assists }) => a + assists, 0);
    let clutch_won = play.reduce((a, { clutch_won }) => a + clutch_won, 0);

    let KDR = kills / death;
    KDR = isFinite(KDR) ? parseFloat(KDR.toFixed(2)) : 0;

    //Here calculated assists per game
    let assists_per = assists / play.length;
    assists_per = isFinite(assists_per)
      ? parseFloat(assists_per.toFixed(2))
      : 0;

    //Here we calculated headshots and headshots percentage
    let headshot = play.reduce((a, { head_shots }) => a + head_shots, 0);
    let headshot_per = (headshot * 100) / kills;
    headshot_per = isFinite(headshot_per)
      ? parseFloat(headshot_per.toFixed(2))
      : 0;

    //here we calculating kills per rounds
    let rounds = play.reduce((a, { rounds_played }) => a + rounds_played, 0);
    let KR = kills / rounds;
    KR = isFinite(KR) ? parseFloat(KR.toFixed(2)) : 0;
    // In this line we are calculated the winning percentage in the
    let winpercent =
      (parseFloat(win.length + 0.5 * draw.length) / play.length) * 100;
    winpercent = isFinite(winpercent) ? parseFloat(winpercent.toFixed(2)) : 0;
    const calculatedStats = [
      { loss: loss.length, class: 'no' },
      { win: win.length, class: 'no' },
      { draw: draw.length, class: 'no' },
      { kills, class: 'no' },
      { death, class: 'no' },
      { KDR, class: 'no' },
      { headshot_per, class: 'no' },
      { KR, class: 'no' },
      { winpercent, class: 'no' },
      { totalgames: play.length, class: 'no' },
      { streaks: streaks, class: 'no' },
      { clutch_won, class: 'no' },
      { assists_per, class: 'no' },
    ];
    return calculatedStats;
  } catch (error) {
    return error;
  }
};

export const compareStatsAndAddClasses = (currentStats, opponentStats) => {
  try {
    currentStats.forEach((el, i) => {
      if (Object.values(el)[0] > opponentStats[i][Object.keys(el)[0]]) {
        el.class = 'green';
        opponentStats[i].class = 'red';
      } else if (Object.values(el)[0] < opponentStats[i][Object.keys(el)[0]]) {
        el.class = 'red';
        opponentStats[i].class = 'green';
      } else if (
        Object.values(el)[0] === opponentStats[i][Object.keys(el)[0]]
      ) {
        el.class = 'yellow';
        opponentStats[i].class = 'yellow';
      }
    });
    return { currentStats, opponentStats };
  } catch (error) {
    return error;
  }
};

export const SuportValidation = (values, image) => {
  let errors = {};
  let isValid = true;
  const { subject, description, category } = values;
  if (!subject.trim()) {
    isValid = false;
    errors.subject = 'Please add subject !';
  } else if (subject.length >= 50) {
    isValid = false;
    errors.subject = 'Subject is to long !';
  }
  if (!description.trim()) {
    isValid = false;
    errors.description = 'Please add description !';
  } else if (description.length >= 5000) {
    isValid = false;
    errors.description = 'description is to long !';
  }
  if (!category) {
    isValid = false;
    errors.category = 'Please select a category !';
  } else if (category === 'Select category') {
    isValid = false;
    errors.category = 'Please select a category !';
  }
  // if (image) {
  //     const type = image.type.split("/")[1];
  //     const size = image.size;
  //     const array = ["jpg", "jpeg", "png", "gif"];
  //     if (!array.includes(type)) {
  //         errors.image = "Please select valid image( jpg | jpeg | png | gif )!";
  //         isValid = false;
  //     } else if (size > 5000000) {
  //         errors.image = "Please select image less than 5MB !";
  //         isValid = false;
  //     }
  // }
  return { isValid, errors };
};

export const validateLadder = (values, bannerimg) => {
  try {
    let errors = {};
    let isValid = true;
    const {
      title,
      ladderPrize,
      playerNumbers,
      ladderStart,
      gameType,
      ladderType,
    } = values;
    // const hours = Math.abs(new Date(ladderStart) - new Date()) / 36e5;
    const checkValid = bannerimg ? bannerimg.type.split('/') : false;
    if (!title.trim()) {
      isValid = false;
      errors.title = 'Ladder title is required !!';
    } else if (title.length > 30) {
      isValid = false;
      errors.title = 'Ladder title is to long !!';
    }
    if (!ladderPrize) {
      isValid = false;
      errors.ladderPrize = 'ladder prize required';
    } else if (ladderPrize <= 0) {
      isValid = false;
      errors.ladderPrize = 'Please enter valid ladder prize !!';
    } else if (ladderPrize > 100000000000000) {
      isValid = false;
      errors.ladderPrize = 'Please enter valid ladder prize !!';
    }
    if (!playerNumbers) {
      isValid = false;
      errors.playerNumbers = 'Players length required !!';
    } else if (playerNumbers >= 1000000) {
      isValid = false;
      errors.playerNumbers = 'Players length is enough !!';
    }
    if (!ladderStart) {
      isValid = false;
      errors.ladderStart = 'Ladder start date required !!';
    }
    // else if (hours < 5) {
    //     isValid = false;
    //     errors.ladderStart = "Atleast 5 hours diffrence from current datetime !!";
    // }
    if (!gameType) {
      isValid = false;
      errors.gameType = 'Please select a game type !!';
    }
    if (!ladderType) {
      isValid = false;
      errors.ladderType = 'Please select ladder type !!';
    }
    if (checkValid) {
      const checkValue = checkValid[1];
      if (
        checkValue === 'png' ||
        checkValue === 'jpg' ||
        checkValue === 'jpeg'
      ) {
        //Here return true
        if (bannerimg.size > 5000000) {
          errors.imgurl = 'Please select image less than 5 mb !!';
          isValid = false;
        }
      } else {
        errors.imgurl = 'Please select png jpg jpeg format';
        isValid = false;
      }
    }
    return { isValid, errors };
  } catch (error) {
    return { isValid: false, errors: { unexpected: 'Unexpected errors !!' } };
  }
};

export const ChooseTime = () => {
  let x = 5; //minutes interval
  let times = []; // time array
  let tt = 0; // start time
  let ap = ['AM', 'PM']; // AM-PM
  //loop to increment the time and push results in array
  for (let i = 0; tt < 24 * 60; i++) {
    let hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
    let mm = tt % 60; // getting minutes of the hour in 0-55 format
    times[i] =
      ('0' + (hh % 12)).slice(-2) +
      ':' +
      ('0' + mm).slice(-2) +
      ' ' +
      ap[Math.floor(hh / 12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
    tt = tt + x;
  }
  times = times.map((el) => {
    return { time: el, select: false };
  });
  return times;
};

export const NoramlDataForLadderList = (playerJoined) => {
  try {
    let Players = [];
    playerJoined.forEach((element) => {
      if (element.UserOrTeam && element.onModel === 'users') {
        const { username, _id } = element.UserOrTeam;
        Players.push({
          name: username,
          kills: 0,
          deaths: 0,
          kdr: 0,
          games: 0,
          wins: 0,
          loss: 0,
          winrate: 0,
          score: 0,
          _id,
          creator: _id,
        });
      } else if (element.UserOrTeam && element.onModel === 'team') {
        const { name, _id, creator } = element.UserOrTeam;
        Players.push({
          name: name,
          kills: 0,
          deaths: 0,
          kdr: 0,
          games: 0,
          wins: 0,
          loss: 0,
          winrate: 0,
          score: 0,
          _id,
          creator,
        });
      }
    });
    return Players;
  } catch (error) {
    return [];
  }
};

export const ChallengePlayerValidation = (values) => {
  try {
    let isValid = true;
    let errors = {};
    let selecDate = null;
    if (!values.chTime) {
      isValid = false;
      errors.chTime = 'Please select time !!';
    }
    if (values.chTime) {
      let { chDate, chTime } = values;
      let localDate = new Date().toLocaleDateString();
      chDate = new Date(`${localDate} ${chTime}`);
      let diff = chDate.getTime() - new Date().getTime();
      let minutes = diff / 60000;
      selecDate = chDate;
      if (minutes <= 5) {
        isValid = false;
        errors.chTime = 'Selected date and time is too early !!';
      }
    }
    return { isValid, errors, selecDate };
  } catch (error) {
    return { isValid: false, errors: { unexpected: 'Unexpected errors !!' } };
  }
};

export const JoinScoutingAreaValidation = (values) => {
  try {
    let errors = {};
    let isValid = true;
    if (values.roles.length <= 0) {
      isValid = false;
      errors.roles = 'Please select a role';
    }
    if (values.isdisappears.length <= 0) {
      isValid = false;
      errors.isdisappears = 'Please select scouting  post disappears day';
    }
    if (values.language.length <= 0) {
      isValid = false;
      errors.language = 'Please select a language';
    } else if (values.language.length >= 10) {
      isValid = false;
      errors.language = 'You have selected to many languages';
    }
    return { isValid, errors };
  } catch (error) {
    return { isValid: false, errors: { unexpected: 'Unexpected errors !!' } };
  }
};

export const handlePersonalDetails = (values) => {
  try {
    let errors = {};
    let isValid = true;
    if (!values.firstname) {
      isValid = false;
      errors.firstname = 'Please enter firstname';
    }
    if (!values.lastname) {
      isValid = false;
      errors.lastname = 'Please enter lastname';
    }
    if (!values.dob) {
      isValid = false;
      errors.dob = 'Please enter date of birth';
    }
    if (!values.street) {
      isValid = false;
      errors.street = 'Please enter street';
    }
    if (!values.zipcodeCity) {
      isValid = false;
      errors.zipcodeCity = 'Please enter zip code';
    }
    if (!values.country) {
      isValid = false;
      errors.country = 'Please select country';
    }
    if (!values.currency) {
      isValid = false;
      errors.currency = 'Please select currency';
    }
    if (!values.phone) {
      isValid = false;
      errors.phone = 'Please select phone number';
    }
    return { isValid, errors };
  } catch (error) {
    console.log(error);
    return { isValid: false, errors: { unexpected: 'Unexpected errors !!' } };
  }
};

export const OrgniseData = (transactions, withdrawls) => {
  let transactionData = [];
  let withdrawData = [];
  transactions = transactions ? transactions : [];
  withdrawls = withdrawls ? withdrawls : [];
  transactions.forEach((el) => {
    let data = {
      total: el.total,
      type: el.transaction_type,
      id: el.transaction_data.id,
      state: el.transaction_data.state,
      date: el.createdAt ? new Date(el.createdAt) : new Date(),
    };
    transactionData.push(data);
  });

  withdrawls.forEach((el) => {
    let data = {
      total: el.amount,
      state: el.approved ? 'approved' : 'pending',
      id: el._id,
      type: 'withdraw',
      date: el.createdAt ? new Date(el.createdAt) : new Date(),
    };
    withdrawData.push(data);
  });

  return [...transactionData, ...withdrawData];
};

export const ValidatePayPalAccount = (values) => {
  //paypalAccount, nickname, dob, mainteam, nationality
  let isValid = true;
  let errors = {};
  const EmailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!values.paypalAccount) {
    errors.pay = 'Account is required !';
    isValid = false;
  } else if (!EmailRegex.test(values.paypalAccount)) {
    errors.email = 'Please enter a valid account !';
    isValid = false;
  }
  if (!values.dob) {
    isValid = false;
    errors.dob = 'dob is required !';
  }
  if (!values.nationality) {
    isValid = false;
    errors.nationality = 'nationality is required !';
  }

  if (!values.nickname) {
    isValid = false;
    errors.nickname = 'nickname is required !';
  }

  return { isValid, errors };
};
export const productReadmeValidation = (values) => {
  try {
    let isValid = true;
    let errors = {};
    if (!values.phone) {
      isValid = false;
      errors.phone = 'Contact Number is required !';
    }
    if (!values.town) {
      isValid = false;
      errors.town = 'Town is required !';
    }
    if (!values.province) {
      isValid = false;
      errors.province = 'Province is required !';
    }
    if (!values.direction) {
      isValid = false;
      errors.direction = 'Direction is required !';
    }
    if (!values.country) {
      isValid = false;
      errors.country = 'country is required !';
    }
    return { isValid, errors };
  } catch (error) {
    return { isValid: false, errors: { unexpected: 'Unexpected errors !!' } };
  }
};

export const CreateFakeRequest = () => {
  return new Promise((resolve) => setTimeout(() => resolve(), 2000));
};

export const CalculatePrestigeFrom = (prestige) => {
  prestige = prestige ? prestige : 1000;
  const AllPrestige = [
    1000, 1200, 1400, 1600, 1800, 2000, 2300, 2600, 2900, 3500,
  ];
  const FromCurrentToPrevious = AllPrestige.filter((el) => el <= prestige);
  let previousPrestige = [];
  FromCurrentToPrevious.forEach((el) => {
    const value = GetPrestigeAccPoint(el);
    previousPrestige.push(value);
  });

  return previousPrestige;
};

export const CheckAlreadyFriend = (
  sentrequest,
  recivedrequest,
  friends,
  _id
) => {
  let checkValid = true;

  let isRequest = false;

  try {
    sentrequest = sentrequest ? sentrequest : [];
    recivedrequest = recivedrequest ? recivedrequest : [];
    friends = friends ? friends : [];
    recivedrequest = recivedrequest.filter(
      (el) => el._id && el._id.toString() === _id.toString()
    );

    sentrequest = sentrequest.filter(
      (el) => el._id && el._id.toString() === _id.toString()
    );

    friends = friends.filter((ele) => {
      return ele.bothfriends.some(
        (elem) => elem._id.toString() === _id.toString()
      );
    });
    if (recivedrequest.length > 0) {
      checkValid = false;
      isRequest = true;
    } else if (sentrequest.length > 0) {
      checkValid = false;
      isRequest = false;
    } else if (friends.length > 0) {
      checkValid = false;
      isRequest = false;
    }
    return { checkValid, isRequest };
  } catch (error) {
    return { checkValid, isRequest };
  }
};

export const CheckAlreadyFollow = (id, following) => {
  following = following ? following : [];
  const isExist = following.filter((el) => el === id);
  if (isExist.length > 0) {
    return true;
  } else {
    return false;
  }
};

export const groupBy = (collection, property) => {
  var i = 0,
    val,
    index,
    values = [],
    result = [];
  for (; i < collection.length; i++) {
    val = collection[i][property];
    index = values.indexOf(val);
    if (index > -1) result[index].push(collection[i]);
    else {
      values.push(val);
      result.push([collection[i]]);
    }
  }
  return result;
};

export const FriendsData = (myfreinds, profileFriends) => {
  try {
    myfreinds = myfreinds ? myfreinds : [];
    profileFriends = profileFriends ? profileFriends : [];
    const firstFriend = profileFriends.map((el) => el.bothfriends[0]);
    const secondFriends = myfreinds.map((el) => el.bothfriends[0]);
    const commanArray = firstFriend.filter((n) => {
      return secondFriends.findIndex((el) => el._id === n._id) !== -1;
    });

    return { commanArray, firstFriend };
  } catch (error) {
    return [];
  }
};

export const CalculateAgeFunction = (dob) => {
  if (dob) {
    const currentYear = new Date().getFullYear();
    const dobYear = new Date(dob).getFullYear();
    const age = currentYear - dobYear;
    return age;
  } else {
    return 'Not Found';
  }
};
