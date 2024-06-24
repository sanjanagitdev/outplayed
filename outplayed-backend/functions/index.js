import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import AWS from 'aws-sdk';
import bluebird from 'bluebird';
import dotenv from 'dotenv';
import util from 'util';
import mysql from 'mysql';
import mysqlconfig from '../config/mysql.json';
import mapImageModel from '../models/map';
import notificationModel from '../models/notification';
import userModel from '../models/user';
import { objectId } from './validations';
import { userJwtKey, cryptoKey, adminJwtKey } from '../config/keys';
import queueModel from '../models/queue';
import joinForPlayModel from '../models/joinforplay';
import groupModel from '../models/group';
import newsModel from '../models/news';
dotenv.config();
// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

// create S3 instance
const s3 = new AWS.S3();

// abstracts function to upload a file returning a promise
export const uploadFile = async (buffer, name, type, folder) => {
  try {
    const bucket = 's3.outplayed.bucket';
    const params = {
      ACL: 'public-read',
      Body: buffer,
      Bucket: `${bucket}/${folder}`,
      ContentType: type.mime,
      Key: `${name}.${type.ext}`,
    };
    const url = await s3.getSignedUrlPromise('putObject', params);
    return s3.upload(params, url).promise();
  } catch (err) {
    return err;
  }
};

export const signJwt = (id, steamid) => {
  try {
    const payload = {
      userid: id,
      steamid: steamid ? steamid : false,
    };
    const token = jwt.sign(payload, userJwtKey, {
      expiresIn: '80h', // expires in 80 hours
    });
    const encryptedToken = encryptData(token);
    if (encryptData) {
      return encryptedToken;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

export const encryptData = (data) => {
  try {
    const algorithm = 'aes-192-cbc';
    const password = cryptoKey;
    const key = crypto.scryptSync(password, 'salt', 24);
    const iv = Buffer.alloc(16, 0);

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (e) {
    return null;
  }
};
export const verifyJwt = (token) => {
  if (token) {
    return new Promise((resolve, reject) => {
      const decryptedToken = decryptPass(token);
      if (decryptedToken) {
        jwt.verify(decryptedToken, userJwtKey, (err, decoded) => {
          if (err) {
            reject(false);
          } else {
            resolve(decoded);
          }
        });
      } else {
        reject(false);
      }
    });
  }
};

export const signJwtAdmin = (id) => {
  try {
    const payload = {
      admin: id,
    };
    const token = jwt.sign(payload, adminJwtKey, {
      expiresIn: '80h', // expires in 80 hours
    });
    const encryptedToken = encryptData(token);
    if (encryptData) {
      return encryptedToken;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

export const verifyJwtAdmin = (token) => {
  if (token) {
    return new Promise((resolve, reject) => {
      const decryptedToken = decryptPass(token);

      if (decryptedToken) {
        jwt.verify(decryptedToken, adminJwtKey, (err, decoded) => {
          if (err) {
            reject(false);
          } else {
            resolve(decoded);
          }
        });
      } else {
        reject(false);
      }
    });
  }
};

const decryptPass = (encryptedPassword) => {
  try {
    const algorithm = 'aes-192-cbc';
    const password = cryptoKey;
    const key = crypto.scryptSync(password, 'salt', 24);
    const iv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const encrypted = encryptedPassword;
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (e) {
    return null;
  }
};

export const checkIfEmpty = (requestBody) => {
  const values = Object.values(requestBody);
  let isEmpty = values.filter((el) => (el ? !el.trim() : !el));
  return {
    isValid: isEmpty.length > 0 ? false : true,
  };
};

export const hashPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      resolve(hashedPassword);
    } catch (e) {
      reject(false);
    }
  });
};

export const verifyPassword = (password, passwordHash) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isPasswordValid = bcrypt.compareSync(password, passwordHash);
      resolve(isPasswordValid);
    } catch (e) {
      reject(false);
    }
  });
};

export const sendMail = async (req, link, type) => {
  try {
    const { email } = req.body;
    const transporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SENDER_HOST,
        port: 465,
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.SENDER_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
        debug: true,
      })
    );
    const MailText = {
      register: `Hi you have successfully registerd
      please click on the ${link} for verify your email`,
      updateemail: `Hi you have successfully updated your email
      please click on the ${link} for re-verify your email`,
      forgetpass: `Hi please click on the ${link} for reset your password`,
    };
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Email Authentication',
      text: MailText[type],
    };
    const response = await transporter.sendMail(mailOptions);
    return response;
  } catch (e) {
    return false;
  }
};

export const sendSteamResponse = (userData, res, client) => {
  const { _id, steamid } = userData;
  const token = signJwt(_id, steamid);
  res.redirect(`${client}?steamlogin=true&authtoken=${token}`);
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
  return prestiges;
};

export const AddMinutes = (minute) => {
  let now = new Date();
  now.setMinutes(now.getMinutes() + minute); // timestamp
  now = new Date(now); // Date object
  return now;
};

export const AllMaps = async (maptype) => {
  try {
    let allmaps = await mapImageModel
      .find({ maptype }, { title: 1, imgurl: 1, _id: 0, open: 1, mapid: 1 })
      .lean();
    return allmaps;
  } catch (e) {
    return [];
  }
};

export const makeDb = (type) => {
  try {
    console.log(mysqlconfig[type]);
    const connection = mysql.createConnection(mysqlconfig[type]);
    return {
      query(sql, args) {
        return util.promisify(connection.query).call(connection, sql, args);
      },
      close() {
        return util.promisify(connection.end).call(connection);
      },
    };
  } catch (e) {
    return e;
  }
};

//This function is used to create notification
export const CreateNotification = async (
  sender,
  reciver,
  topic,
  type,
  io,
  teamid,
  customObjects
) => {
  try {
    const createNotification = await notificationModel.create({
      sender,
      reciver,
      topic,
      type,
      teamid,
      customObjects,
    });
    await userModel.updateOne(
      { _id: reciver },
      { $push: { notification: createNotification._id } }
    );
    io.in(reciver.toString()).emit('GetNotifications', createNotification);
  } catch (e) {
    return e;
  }
};

// This function is used to send Invitation to all invited members
export const sendInvitation = async (
  sender,
  topic,
  type,
  io,
  usersArray,
  teamid
) => {
  try {
    usersArray.forEach((element) => {
      CreateNotification(sender, element, topic, type, io, teamid);
    });
  } catch (e) {
    return e;
  }
};

export const compareArray = (concated, invitearray) => {
  let check = false;
  concated.forEach((ele) => {
    const checFilter = invitearray.filter(
      (el) => el.toString() === ele.toString()
    );
    if (checFilter.length > 0) {
      check = true;
    }
  });
  return check;
};

export const CheckAlreadyJoined = (
  joinedmembers,
  invitedmembers,
  id,
  state,
  length
) => {
  let isValid = true;
  let errors = {};
  const joined = joinedmembers.filter((el) => el.toString() === id);
  const invited = invitedmembers.filter((el) => el.toString() === id);
  if (joined.length > 0) {
    isValid = false;
    errors.joined = 'You already exist in this group';
  }
  if (joined.length >= length) {
    isValid = false;
    errors.full = 'All available slots are full';
  }
  if (invited.length <= 0) {
    isValid = false;
    errors.invited = 'Unexpected error';
  }
  if (state !== 'primary') {
    isValid = false;
    errors.state = 'Unexpected error';
  }
  return { isValid, errors };
};

export const ConnectInvite = async (id, userid, io) => {
  try {
    const checkValidUser = await userModel.findById(id);
    if (checkValidUser) {
      await userModel.updateOne(
        {
          $and: [{ _id: id }, { invitedfriends: { $ne: objectId(userid) } }],
        },
        { $push: { invitedfriends: userid }, $inc: { coins: 200 } }
      );
      await userModel.updateOne(
        { $and: [{ _id: userid }, { invitedby: { $ne: objectId(id) } }] },
        { invitedby: id }
      );
      io.in(id.toString()).emit('GetNotifications');
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return e;
  }
};

export const QueueLength = async (type) => {
  try {
    const queueLength = await queueModel.countDocuments({
      valid: true,
      queuetype: type,
    });
    return queueLength;
  } catch (e) {
    return 0;
  }
};

//Calculating total stats for hubs list / matchmaking ranking
export const SetAsNormal = async (type) => {
  let MonthlyRank = await CurrentMonthStats(type);
  let playedArray = [];
  let unPlayedArray = [];
  MonthlyRank.forEach((el) => {
    if (el.result) {
      let obj = Object.assign({}, el.userid, el.result);
      playedArray.push(obj);
    } else {
      // unPlayedArray.push(el.userid);
    }
  });
  playedArray = playedArray
    .map((el, i, array) => {
      let loss = array.filter(
        (element) =>
          element.result === 'loss' &&
          element._id.toString() === el._id.toString()
      );
      let win = array.filter(
        (element) =>
          element.result === 'win' &&
          element._id.toString() === el._id.toString()
      );
      let draw = array.filter(
        (element) =>
          element.result === 'draw' &&
          element._id.toString() === el._id.toString()
      );
      let matchplayed = [...win, ...loss, ...draw];
      el.win = win.length;
      el.lost = loss.length;
      el.winpercent =
        (parseFloat(win.length + 0.5 * draw.length) / matchplayed.length) * 100;
      el.match = matchplayed.length;
      return el;
    })
    .reduce((unique, o) => {
      if (!unique.some((obj) => obj._id.toString() === o._id.toString())) {
        unique.push(o);
      }
      return unique;
    }, [])
    .sort((a, b) => b.win - a.win);
  const fullArray = [...playedArray, ...unPlayedArray];
  return fullArray;
};

export const RemoveFromOldGroup = async (groupid, userid, io) => {
  try {
    /**
     ** In this function we are implemented the logic for remove a user from group
     *^ there is multiple conditions
     * 1 - remove user from the group.
     * 2 - after that check the user is creator if - yes
     * 3 - then check other users are exist or not in the group if -yes
     * 4 - then provide the creator slot to that user
     * ! IF there is no any player then delete teh group
     */
    const dataUpdated = await groupModel.findOneAndUpdate(
      { _id: groupid, 'members.user._id': objectId(userid) },
      {
        $unset: {
          'members.$.user': '',
          'members.$.joinedAt': '',
        },
        $set: {
          'members.$.invited': false,
          'members.$.joined': false,
        },
      },
      { new: true }
    );
    const { members, creator } = dataUpdated;
    await userModel.updateOne({ _id: userid }, { $unset: { group: '' } });
    if (creator.toString() === userid.toString()) {
      const checkIsPlayerExist = members.filter((el) => el.user);
      if (checkIsPlayerExist.length > 0) {
        const {
          user: { _id },
          user,
          index,
        } = checkIsPlayerExist[0];
        await userModel.updateOne({ _id }, { group: groupid });
        await groupModel.updateOne(
          {
            _id: groupid,
            'members.index': 0,
          },
          {
            $set: {
              'members.$.user': user,
              'members.$.invited': true,
              'members.$.joined': true,
            },
            creator: _id,
          }
        );
        await groupModel.updateOne(
          {
            _id: groupid,
            'members.index': index,
          },
          {
            $unset: {
              'members.$.user': '',
              'members.$.joinedAt': '',
            },
            $set: {
              'members.$.invited': false,
              'members.$.joined': false,
            },
          }
        );
        // ^ Here we notify all the users for the group activity
        NotifYAllGroupMembers(checkIsPlayerExist, io);
      } else {
        await groupModel.deleteOne({ _id: groupid });
      }
    } else {
      // ^ Here we notify all the users for the group activity
      const OtherMembers = members.filter((el) => el.user);
      NotifYAllGroupMembers(OtherMembers, io);
    }
    return true;
  } catch (e) {
    return e;
  }
};

export const CreateGroup = async (userid) => {
  try {
    /**
     *^ In this function we are trying to create a group with a default user , who is as a creator of the group.
     */
    const { username, useravatar, steamid, _id } = await userModel.findById(
      userid,
      {
        username: 1,
        useravatar: 1,
        steamid: 1,
      }
    );
    const members = [
      {
        user: { username, useravatar, steamid, _id, joinedAt: new Date() },
        index: 0,
        invited: false,
        joined: true,
      },
      { index: 1, invited: false, joined: false },
      { index: 2, invited: false, joined: false },
      { index: 3, invited: false, joined: false },
      { index: 4, invited: false, joined: false },
    ];
    const CreateGroupData = await groupModel.create({ members, creator: _id });
    await userModel.updateOne({ _id }, { group: CreateGroupData._id });
    return true;
  } catch (e) {
    return e;
  }
};

export const NotifYAllGroupMembers = (PlayerArray, io) => {
  PlayerArray.forEach((el) => {
    io.in(el.user._id.toString()).emit('LeaveGroup');
  });
};

export const GetRequiredDataOnThePages = async () => {
  try {
    const SlideNews = await newsModel
      .find({}, { title: 1, imgurl: 1, content: 1 })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();
    const QueueLength5vs5 = await QueueLength('5vs5');
    const QueueLength1vs1 = await QueueLength('1vs1');
    const Stats1vs1 = await SetAsNormal('matchmaking1vs1');
    const Stats5vs5 = await SetAsNormal('matchmaking');
    return {
      SlideNews,
      QueueLength5vs5,
      QueueLength1vs1,
      Stats1vs1,
      Stats5vs5,
    };
  } catch (e) {
    return e;
  }
};

const CurrentMonthStats = async (type) => {
  try {
    let CurrentMonthStats = await joinForPlayModel.aggregate([
      {
        $match: {
          $and: [{ running: false }, { jointype: type }],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userid',
          foreignField: '_id',
          as: 'userid',
        },
      },
      { $unwind: '$userid' },
      {
        $project: {
          userid: '$userid',
          month: { $month: '$createdAt' },
          createdAt: 1,
          result: {
            result: 1,
            kills: 1,
            deaths: 1,
          },
          jointype: 1,
          userid: {
            _id: 1,
            username: 1,
            useravatar: 1,
            prestige: 1,
            monthlyhubpoint: 1,
            prestige1vs1: 1,
            ispremium: 1,
            ispremiumadvanced: 1,
          },
        },
      },
      { $match: { month: new Date().getMonth() + 1 } },
    ]);
    return CurrentMonthStats;
  } catch (error) {
    return error;
  }
};

export const IsMemberShip = (isPremium, isPremiumAdvanced) => {
  if (!isPremium && !isPremiumAdvanced) {
    return 'Normal';
  } else if (isPremium && !isPremiumAdvanced) {
    return 'Premium';
  } else if (!isPremium && isPremiumAdvanced) {
    return 'Premium/advanced';
  } else {
    return 'Normal';
  }
};

export const GetDiffrenceInMinutes = (tournamentStart) => {
  let startTime = new Date();
  let endTime = new Date(tournamentStart);
  let difference = endTime.getTime() - startTime.getTime();
  const resultInMinutes = Math.round(difference / 60000);
  return resultInMinutes;
};

export const GetCalculateStatistics = async (userid, type) => {
  try {
    const statsType =
      type === '1vs1'
        ? ['matchmaking1vs1', 'tournament1vs1']
        : ['matchmaking5vs5', 'tournament5vs5', 'hub'];
    const refrenceType =
      type === '1vs1'
        ? {
            result: 1,
            kills: 1,
            deaths: 1,
            rounds: 1,
            headshots: 1,
          }
        : {
            rounds_played: 1,
            kills: 1,
            deaths: 1,
            assists: 1,
            head_shots: 1,
            damage: 1,
            clutch_won: 1,
            result: 1,
          };
    let StatsForCompare = await joinForPlayModel.aggregate([
      {
        $match: {
          $and: [
            { running: false },
            { jointype: { $in: statsType } },
            { userid: objectId(userid) },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userid',
          foreignField: '_id',
          as: 'userid',
        },
      },
      { $unwind: '$userid' },
      {
        $project: {
          userid: '$userid',
          month: { $month: '$createdAt' },
          createdAt: 1,
          result: refrenceType,
          jointype: 1,
          userid: {
            _id: 1,
            username: 1,
            useravatar: 1,
            prestige: 1,
            prestige1vs1: 1,
            prestige: 1,
          },
        },
      },
    ]);
    return StatsForCompare;
  } catch (error) {
    return error;
  }
};

export const CheckIsPremiumPlayer = async (userid) => {
  try {
    const { ispremium, ispremiumadvanced } = await userModel
      .findById(userid, {
        ispremium: 1,
        ispremiumadvanced: 1,
      })
      .lean();
    if (ispremium || ispremiumadvanced) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
};

export const InformToTeamMembers = async (
  from,
  to,
  title,
  fromname,
  toname,
  challengeBy,
  challengeTo,
  io
) => {
  try {
    //Here we send notification to other team members
    let topic = `${fromname} challenegs to ${toname} in the ${title} ladder`;
    let type = 'ladder';
    from = from.filter((ele) => ele.toString() !== challengeBy.toString());
    from.forEach((el) => {
      CreateNotification(challengeBy, el, topic, type, io);
    });
    to = to.filter((ele) => ele.toString() !== challengeTo.toString());
    to.forEach((el) => {
      CreateNotification(challengeBy, el, topic, type, io);
    });
    //Here we send notification to captain
    CreateNotification(challengeBy, challengeTo, topic, 'laddercap', io);
  } catch (error) {
    return error;
  }
};

export const CreateFilterObject = (values) => {
  try {
    let objects = {};
    if (values.roles.length > 0) {
      objects['roles'] = { $in: values.roles };
    }
    if (values.language.length > 0) {
      objects['language'] = { $in: values.language };
    }
    return objects;
  } catch (error) {
    return {};
  }
};

export const LastMatchesData = async (userid) => {
  try {
    let LastMatchesData = [];
    const lastMatches = await joinForPlayModel
      .find({ $and: [{ userid: objectId(userid) }, { running: false }] })
      .populate({
        path: 'hubid roomid',
        select: {
          team1: 1,
          team2: 1,
          maps: 1,
        },
        populate: {
          path: 'team1 team2',
          populate: {
            path: 'userid',
            select: {
              username: 1,
            },
          },
          select: {
            userid: 1,
            result: 1,
          },
        },
      })
      .lean();

    lastMatches.forEach((el) => {
      const { jointype, hubid, roomid } = el;
      const { team1, team2, maps } = hubid ? hubid : roomid ? roomid : {};
      if (team1 && team2) {
        const { userid: team1UserId, result: team1Result } = team1
          ? team1[0]
          : {};
        const { userid: team2UserId, result: team2Result } = team2
          ? team2[0]
          : {};

        const { username: username1 } = team1UserId
          ? team1UserId
          : { username: 'Team1' };
        const { username: username2 } = team2UserId
          ? team2UserId
          : { username: 'Team2' };

        const result1 = team1Result ? team1Result : { result: 'N/A' };
        const result2 = team2Result ? team2Result : { result: 'N/A' };
        const mapData = maps ? maps.filter((el) => el.open)[0] : null;

        const objectData = {
          veds: `${username1} vs ${username2}`,
          jointype,
          result: `${result1.result} / ${result2.result}`,
          maps: mapData,
        };

        LastMatchesData.push(objectData);
      }
    });

    return LastMatchesData;
  } catch (error) {
    // console.log(error);
    return [];
  }
};
