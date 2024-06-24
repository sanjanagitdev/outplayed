import vdfg from 'simple-vdf';
import SteamID from 'steamid';
import SSH from 'simple-ssh';
const { connect } = require('working-rcon');
import hubsModel from '../models/hubs';
import joinForPlayModel from '../models/joinforplay';
import userModel from '../models/user';
import { AddMinutes, AllMaps, makeDb } from './';
import { objectId } from './validations';
let ArrayOfTimers = [];

/**
 *Select the captain choice will not be random, in the field of gather created by a premium player,
this will be chosen directly as captain of a team and the other will be the player with
the highest Prestige (ELO) has. In addition, the premium player will have the ability to
first choose the player they want. On the other hand, when the gather has been
created automatically without premium players, the 2 captains will be the ones with
the highest Prestige (ELO) have. In the event that there are 2 or more players with
the same Prestige (ELO), the one with the highest KDA will take precedence. */

export const CheckMinimumPlayers = async (io, hubid) => {
  try {
    const {
      joinedplayers,
      premium,
      premiumadvanced,
      createdby,
    } = await hubsModel
      .findById(hubid)
      .populate({
        path: 'joinedplayers',
        populate: {
          path: 'userid',
          select: {
            prestige: 1,
          },
        },
      })
      .lean();
    //Checks length of joined players in the lobby
    if (joinedplayers.length === 4) {
      //checks premium or premium advanced user
      if (premium || premiumadvanced) {
        const filterCaptainExist = joinedplayers.filter(
          (el) => el.userid._id.toString() === createdby.toString()
        );
        if (filterCaptainExist.length > 0) {
          await PickPremumDefaultCaptain(hubid, createdby, joinedplayers, io);
          io.in(hubid).emit('PlayerJoinHubFull');
        } else {
          await PickCaptainForNormal(hubid, joinedplayers, io);
          io.in(hubid).emit('PlayerJoinHubFull');
        }
      } else {
        //normal user
        await PickCaptainForNormal(hubid, joinedplayers, io);
        io.in(hubid).emit('PlayerJoinHubFull');
      }
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};

const PickPremumDefaultCaptain = async (hubid, userid, joinedplayers, io) => {
  const filterCreatedBy = joinedplayers.filter(
    (element) => element.userid._id.toString() === userid.toString()
  );

  const SortByPrestige = joinedplayers
    .filter((element) => element.userid._id.toString() !== userid.toString())
    .sort((a, b) => b.userid.prestige - a.userid.prestige);

  if (filterCreatedBy.length > 0 && SortByPrestige.length > 0) {
    const { _id: id1, userid } = filterCreatedBy[0];
    const { _id: id2 } = SortByPrestige[0];
    await joinForPlayModel.updateMany(
      { _id: { $in: [id1, id2] } },
      { iscaptain: true }
    );
    await hubsModel.updateOne(
      { _id: hubid },
      {
        $push: {
          team1: id1,
          team2: id2,
        },
        $pull: {
          joinedplayers: { $in: [id1, id2] },
        },
        checkfull: 'true',
      }
    );
    PlayerPickTimer(hubid, userid._id, io, 60, 'pick');
    return true;
  }
};

const PickCaptainForNormal = async (hubid, joinedplayers, io) => {
  const SortByPrestige = joinedplayers.sort(
    (a, b) => b.userid.prestige - a.userid.prestige
  );
  if (SortByPrestige.length > 0) {
    const { _id: id1, userid } = SortByPrestige[0];
    const { _id: id2 } = SortByPrestige[1];
    await joinForPlayModel.updateMany(
      { _id: { $in: [id1, id2] } },
      { iscaptain: true }
    );
    await hubsModel.updateOne(
      { _id: hubid },
      {
        $push: {
          team1: id1,
          team2: id2,
        },
        $pull: {
          joinedplayers: { $in: [id1, id2] },
        },
        checkfull: 'true',
      }
    );
    PlayerPickTimer(hubid, userid._id, io, 60, 'pick');
    return true;
  }
};

export const PlayerPickTimer = async (
  hubid,
  playerid,
  io,
  timervalue,
  type
) => {
  try {
    let timer = parseInt(timervalue);
    let PickInterval = setInterval(async () => {
      const { joinedplayers, maps, team1, team2 } = await hubsModel
        .findById(hubid)
        .populate({
          path: 'team1',
          populate: {
            path: 'userid',
            select: {
              username: 1,
              steamid: 1,
            },
          },
        })
        .populate({
          path: 'team2',
          populate: {
            path: 'userid',
            select: {
              username: 1,
              steamid: 1,
            },
          },
        })
        .lean();
      if (type === 'pick') {
        if (joinedplayers.length <= 0) {
          const mapsdata = await AllMaps('5vs5');
          await hubsModel.updateOne(
            { _id: hubid },
            { mapvoting: 'true', maps: mapsdata }
          );
          io.in(hubid).emit('PlayerJoinHubFull');
          CheckPlayerPick(hubid, playerid, io, 'mappick');
        } else {
          io.in(hubid).emit('PlayerPickTimer', { playerid, timer });
        }
      } else if (type === 'mappick') {
        //Here filter last unbanned map
        const FilteredMaps = maps.filter((el) => el.open);
        if (FilteredMaps.length === 1) {
          let portData = {
            ip: '15.236.76.102',
            port: 27016,
            password: '123',
            sshuser: 'tom',
            sshpassword: 'outplayed123!',
          };
          let gameMap = FilteredMaps[0].title;
          let afterTeam = null;
          let playerarray = [];
          let allPlayers = [...team1, ...team2];
          startGame(
            allPlayers,
            portData,
            playerarray,
            afterTeam,
            hubid,
            io,
            gameMap
          );
          ClearTimer(hubid);
        } else {
          io.in(hubid).emit('PlayerPickTimer', { playerid, timer });
          console.log('pick map timer =>>>>', timer);
        }
      }
      //Here Add a penalty on the user who did not pick a player in backword timer
      if (timer <= 0) {
        ClearTimer(hubid);
        ExpelledCaptainRevertAsOld(hubid, playerid, type, io);
      }
      timer--;
    }, 1000);
    ArrayOfTimers.push({ [hubid]: PickInterval });
  } catch (e) {
    console.log('error in the pick timer =>>>', e);
    ClearTimer(hubid);
  }
};
export const CheckPlayerPick = (hubid, playerid, io, type) => {
  ClearTimer(hubid);
  PlayerPickTimer(hubid, playerid, io, 60, type);
};

export const ClearTimer = (hubid) => {
  try {
    let filtered = [...ArrayOfTimers];
    let mydata = filtered.filter((el) => Object.keys(el)[0] == hubid);
    filtered = filtered.filter((el) => Object.keys(el)[0] !== hubid);
    clearInterval(Object.values(mydata[0])[0]);
    ArrayOfTimers = filtered;
  } catch (e) {
    console.log('error in clear timer =>>>', e);
    return e;
  }
};

const ExpelledCaptainRevertAsOld = async (hubid, userid, type, io) => {
  try {
    let { team1, team2, joinedplayers, maps } = await hubsModel
      .findById(hubid)
      .populate({
        path: 'team1',
      })
      .populate({
        path: 'team2',
      })
      .lean();
    const FilterFrom1 = team1.filter(
      (el) => el.userid.toString() === userid.toString() && el.iscaptain
    );
    const FilterFrom2 = team2.filter(
      (el) => el.userid.toString() === userid.toString() && el.iscaptain
    );
    const Others1 = team1.filter(
      (el) => el.userid.toString() !== userid.toString() && !el.iscaptain
    );
    const Others2 = team2.filter(
      (el) => el.userid.toString() !== userid.toString() && !el.iscaptain
    );
    [...Others1, ...Others2].forEach((el) => {
      joinedplayers.push(el._id);
    });
    maps.forEach((el) => {
      el.open = true;
    });
    let id = null;
    let object = null;
    if (FilterFrom1.length > 0) {
      joinedplayers.push(team2[0]._id);
      object = {
        team1: [],
        team2: [],
        joinedplayers,
        checkfull: 'false',
        mapvoting: 'false',
        maps,
      };
      id = FilterFrom1[0]._id;
    }
    if (FilterFrom2.length > 0) {
      joinedplayers.push(team1[0]._id);
      object = {
        team1: [],
        team2: [],
        joinedplayers,
        checkfull: 'false',
        mapvoting: 'false',
        maps,
      };
      id = FilterFrom2[0]._id;
    }
    console.log(object, id);
    await hubsModel.updateOne({ _id: hubid }, object);
    await joinForPlayModel.deleteOne({ _id: id });
    await joinForPlayModel.updateMany({ hubid }, { iscaptain: false });
    await userModel.updateOne({ _id: userid }, { penalty: AddMinutes(15) });
    io.in(hubid).emit('HubGameCancelled', { userid });
    console.log(type);
  } catch (e) {
    console.log(e, 'error in the expelled section ');
    return 0;
  }
};

const startGame = async (
  players,
  portData,
  playerarray,
  afterTeam,
  hubid,
  io,
  map
) => {
  try {
    console.log('port from function', portData);
    let rcon = await connect(
      portData.ip.toString(),
      parseInt(portData.port),
      portData.password,
      5000
    );
    await rcon.command('sm plugins reload assignteams.smx');
    console.log('plugin1 reloaded');
    await rcon.command('sm plugins reload WarmupCheck.smx');
    console.log('plugin2 reloaded');
    players.forEach(async (player, i) => {
      let sid = new SteamID(player.userid.steamid);
      let newsid = '"' + sid.getSteam2RenderedID(true).toString() + '"';
      console.log('sm_whitelist_add' + ' ' + newsid);
      // const playerSlot = player.playerslot
      if (i < 2) {
        console.log('username', player.userid.username + ' ' + 'team', 'T');
        afterTeam = 'CS_TEAM_T';
      } else if (i >= 2) {
        console.log('username', player.userid.username + ' ' + 'team', 'CT');
        afterTeam = 'CS_TEAM_CT';
      }
      let newsid1 = sid.getSteam2RenderedID(true);
      playerarray.push({
        [newsid1]: {
          [newsid1]: afterTeam,
        },
      });
      await rcon.command('sm_whitelist_add' + ' ' + newsid);

      console.log('whitelisted');
    });
    // await rcon.command('tv_enable 1')
    // await rcon.command('tv_delay 30')
    // await rcon.command('tv_advertise_watchable 1')
    // await rcon.command(`sm_record_name ${hubid}`)
    await rcon.command(`changelevel ${map}`);

    console.log('disconecting rcon');

    await rcon.disconnect();

    console.log('map changed');

    let str1 = "'" + '"base"' + '{';

    playerarray.forEach(function (el) {
      str1 += vdfg.stringify(el);
    });

    let newstr = str1 + '}' + "'";
    const ssh = new SSH({
      host: portData.ip,
      user: portData.sshuser,
      pass: portData.sshpassword,
    });
    console.log('newstrrrr=>>>>>>', newstr);
    await ssh
      .exec(
        `cd ../../home/steam/csgo-ds/csgo/addons/sourcemod/data/text && printf ${newstr}  > assignteams.txt`,
        {
          out: function (stdout) {
            console.log('stdout', stdout);
          },
        }
      )
      .start();
    let configuredData = portData.ip.toString() + ':' + portData.port;
    await hubsModel.updateOne({ _id: hubid }, { joinip: configuredData });
    io.in(hubid).emit('SetHubsIP', { ip: configuredData });
    const rconv = Math.random();
    IntervalFunctionForUpdateID(
      portData.ip.toString(),
      rconv,
      portData.port,
      portData.password,
      hubid,
      io
    );
  } catch (e) {
    console.log('error in the start game section..', e);
    io.in(hubid).emit(
      'HubsErrorOccured',
      'Cannot connect to server, please try again later.'
    );
  }
};

const IntervalFunctionForUpdateID = async (
  rconip,
  rconvar,
  port,
  rconpassword,
  id,
  io
) => {
  //This function is used for check the connected people on the server for store mongodb id in the mysql database for fetch the stats of the game kill,deths etc....
  console.log('Second Interval function fired');
  let i = id;
  let db;
  try {
    i = setInterval(async () => {
      let rcon = rconvar;
      try {
        rcon = await connect(rconip, parseInt(port), rconpassword, 5000);
        const status = await rcon.command('status');
        console.log('Joined player status', status);
        if (status.includes('2 humans')) {
          db = makeDb('5vs5');
          let { team1 } = await hubsModel
            .findById(id, {
              team1: 1,
            })
            .populate({
              path: 'team1',
              populate: {
                path: 'userid',
                select: {
                  steamid: 1,
                },
              },
            });
          //Later we will fetch from team1[0].userid.steamid when 4 players testing---------
          //for now i have added my id for test the game
          //let sttid = "76561198884721329";
          const someRows = await db.query(
            "SELECT * FROM wm_results inner join wm_round_stats ON wm_results.match_id = wm_round_stats.match_id where type IS NULL AND wm_round_stats.steam_id_64 = '" +
              team1[0].userid.steamid +
              "' ORDER BY match_start DESC"
          );
          console.log('Data found for rows =>>>>', someRows);
          if (someRows.length > 0) {
            let { match_id } = someRows[0];
            let myQyery = await db.query(
              "UPDATE wm_results SET type = '" +
                id.toString() +
                "' WHERE match_id = '" +
                match_id +
                "'"
            );
            if (myQyery) {
              db.close();
              clearInterval(i);
              IntervalFunctionForGetStats(
                rconip,
                rconvar,
                port,
                rconpassword,
                id,
                io
              );
              console.log('query fired data updated');
            }
          } else {
            console.log('not some someRows');
            db.close();
          }
        }
        await rcon.disconnect();
      } catch (err1) {
        console.log('Here first catch block', err1);
        db.close();
        clearInterval(i);
      }
    }, 120000);
  } catch (err2) {
    console.log('Here second catch block', err2);
    db.close();
    clearInterval(i);
  }
};
const IntervalFunctionForGetStats = async (
  rconip,
  rconvar,
  port,
  rconpassword,
  id,
  io
) => {
  let i = rconip;
  let db;
  try {
    i = setInterval(async () => {
      let rcon = rconvar;
      try {
        rcon = await connect(rconip, parseInt(port), rconpassword, 5000);
        const status = await rcon.command('status');
        console.log('status', status);
        if (status.includes('0 humans')) {
          db = makeDb('5vs5');
          let { team1, team2 } = await hubsModel
            .findById(id, {
              userid: 1,
            })
            .populate({
              path: 'team1',
              populate: {
                path: 'userid',
                select: {
                  steamid: 1,
                },
              },
            })
            .populate({
              path: 'team2',
              populate: {
                path: 'userid',
                select: {
                  steamid: 1,
                },
              },
            })
            .lean();
          const players = [...team1, ...team2];
          let someRows = await db.query(
            "SELECT * FROM wm_results inner join wm_round_stats ON wm_results.match_id = wm_round_stats.match_id where type = '" +
              id.toString() +
              "'"
          );

          if (someRows.length > 0) {
            someRows.forEach(async (el) => {
              let filterFromPlayer = players.filter(
                (ele) => ele.userid.steamid == el.steam_id_64
              );
              if (filterFromPlayer.length > 0) {
                if (
                  el.team === 1 &&
                  el.t_name === 'Counter-Terrorists' &&
                  el.ct_name === 'Terrorists'
                ) {
                  if (el.ct_overall_score === el.t_overall_score) {
                    el.result = 'draw';
                    el.points = 3;
                  } else if (el.ct_overall_score > el.t_overall_score) {
                    el.result = 'win';
                    el.points = 5;
                  } else {
                    el.result = 'loss';
                    el.points = -5;
                  }
                } else if (
                  el.team === 1 &&
                  el.t_name === 'Terrorists' &&
                  el.ct_name === 'Counter-Terrorists'
                ) {
                  if (el.ct_overall_score === el.t_overall_score) {
                    el.result = 'draw';
                    el.points = 3;
                  } else if (el.t_overall_score > el.ct_overall_score) {
                    el.result = 'win';
                    el.points = 5;
                  } else {
                    el.result = 'loss';
                    el.points = -5;
                  }
                } else if (
                  el.team === 2 &&
                  el.t_name === 'Counter-Terrorists' &&
                  el.ct_name === 'Terrorists'
                ) {
                  if (el.ct_overall_score === el.t_overall_score) {
                    el.result = 'draw';
                    el.points = 3;
                  } else if (el.t_overall_score > el.ct_overall_score) {
                    el.result = 'win';
                    el.points = 5;
                  } else {
                    el.result = 'loss';
                    el.points = -5;
                  }
                } else if (
                  el.team === 2 &&
                  el.t_name === 'Terrorists' &&
                  el.ct_name === 'Counter-Terrorists'
                ) {
                  if (el.ct_overall_score === el.t_overall_score) {
                    el.result = 'draw';
                    el.points = 3;
                  } else if (el.ct_overall_score > el.t_overall_score) {
                    el.result = 'win';
                    el.points = 5;
                  } else {
                    el.result = 'loss';
                    el.points = -5;
                  }
                }
                const { userid } = filterFromPlayer[0];
                await joinForPlayModel.updateOne(
                  {
                    hubid: objectId(id),
                    userid: userid,
                  },
                  {
                    result: el,
                    running: false,
                  }
                );
                await userModel.updateOne(
                  {
                    _id: userid,
                  },
                  {
                    $inc: {
                      monthlyhubpoint: el.points,
                    },
                  }
                );
              }
            });
            await hubsModel.updateOne(
              {
                _id: id,
              },
              {
                running: false,
              }
            );
            await joinForPlayModel.updateMany(
              {
                hubid: objectId(id),
              },
              {
                running: false,
              }
            );
          }
          db.close();
          io.in(id).emit('resetRoom');
          clearInterval(i);
          console.log('clearing interval', 'ip is', rconip, 'port is', port);
        }
        await rcon.disconnect();
      } catch (e) {
        console.log('error in the inter function first', e);
        db.close();
        io.in(id).emit('resetRoom');
        clearInterval(i);
      }
      //19000
      //180000
    }, 180000);
  } catch (e) {
    console.log('error in the inter function last', e);
    db.close();
    io.in(id).emit('resetRoom');
    clearInterval(i);
  }
};

// This function is used to check how much players are joined on the server

export const interFunction3 = async (
  rconip,
  rconvar,
  port,
  rconpassword,
  id
) => {
  console.log(
    'called interval function 3',
    rconip,
    rconvar,
    port,
    rconpassword,
    id
  );
  //This function is used to check the how many palyers connected on the server
  let i = id;
  try {
    // i = setInterval(async () => {
    let { team1, team2, minutescheck } = await hubsModel
      .findById(id, {
        team1: 1,
        team2: 1,
        minutescheck: 1,
      })
      .populate({
        path: 'team1',
        populate: {
          path: 'userid',
          select: {
            steamid: 1,
          },
        },
      })
      .populate({
        path: 'team2',
        populate: {
          path: 'userid',
          select: {
            steamid: 1,
          },
        },
      });
    console.log(team1, team2, minutescheck);

    // if (time <= 0) {
    //     clearInterval(i);
    //     let rcon = rconvar;
    //     rcon = await connect(rconip, parseInt(port), rconpassword, 5000);
    //     let concatedArray = [...teamA, ...teamB];
    //     let notConnectedPlayers = [];
    //     let allConnectedPlayers = [];
    //     let allConnected = true;
    //     const status = await rcon.command("status");
    //     concatedArray.forEach((el) => {
    //         let sid = new SteamID(el.steamid);
    //         let newsid1 = sid.getSteam2RenderedID(true);
    //         if (status.includes(newsid1)) {
    //             allConnectedPlayers.push(`#${newsid1}`);
    //         } else {
    //             allConnected = false;
    //             notConnectedPlayers.push({
    //                 username: el.username,
    //                 _id: el._id,
    //             });
    //         }
    //     });
    //     if (!allConnected) {
    //         await rcon.command(
    //             "sm_kick" +
    //                 " " +
    //                 "@all" +
    //                 " " +
    //                 "You are kicked from server bcz all players not joined"
    //         );
    //         await DoBan(notConnectedPlayers);
    //         await rcon.disconnect();
    //         clearInterval(i);
    //     } else {
    //         await rcon.disconnect();
    //         clearInterval(i);
    //     }
    // } else {
    //     hubsModel.updateOne(
    //         { _id: id },
    //         {
    //             $inc: {
    //                 minutescheck: -1,
    //             },
    //         }
    //     );
    // }
    // }, 1000);
  } catch (e) {
    console.log('error in catch block in interFunction3', e);
    clearInterval(i);
  }
};

const DoBan = async (players) => {
  try {
    if (players.length > 0) {
      let tt = players.splice(0, 1);
      let { _id } = tt[0];
      let playerData = await userModel.findById(_id, {
        banobject: 1,
      });
      let { banobject } = playerData ? playerData : {};
      banobject = banobject ? banobject : [];
      let currentDate = new Date().toLocaleDateString();
      let filterToday = banobject.filter(
        (el) => new Date(el.date).toLocaleDateString() === currentDate
      );
      let now = new Date();
      if (filterToday.length > 0) {
        let checkBanType = filterToday[0].attempt;
        let attempt;
        let banUntil;
        if (checkBanType === 1) {
          attempt = 1 + 1;
          now.setMinutes(now.getMinutes() + 60);
          banUntil = new Date(now);
        } else if (checkBanType === 2) {
          attempt = 2 + 1;
          now.setHours(now.getHours() + 8);
          banUntil = new Date(now);
        } else if (checkBanType >= 3) {
          attempt = 3 + 1;
          now.setHours(now.getHours() + 24);
          banUntil = new Date(now);
        }
        await userModel.updateOne(
          {
            _id,
            'banobject.date': currentDate,
          },
          {
            $set: {
              'banobject.$.attempt': attempt,
            },
            banuntil: banUntil,
          }
        );
        DoBan(players);
      } else {
        now.setMinutes(now.getMinutes() + 30);
        let banUntil = new Date(now);
        await userModel.updateOne(
          {
            _id,
          },
          {
            banobject: [
              {
                date: currentDate,
                attempt: 1,
              },
            ],
            banuntil: banUntil,
          }
        );
        DoBan(players);
      }
    } else {
      return true;
    }
  } catch (e) {
    //e
  }
};

export const CreateHubsSearchObject = (req) => {
  const { name, prestige } = req.query;
  let object;
  if (name && prestige) {
    object = {
      $and: [
        {
          name: {
            $regex: new RegExp('^' + name.toLowerCase(), 'i'),
          },
        },
        { prestige },
      ],
    };
  } else if (name && !prestige) {
    object = {
      name: {
        $regex: new RegExp('^' + name.toLowerCase(), 'i'),
      },
    };
  } else if (!name && prestige) {
    object = { prestige };
  } else {
    object = {};
  }
  return object;
};
