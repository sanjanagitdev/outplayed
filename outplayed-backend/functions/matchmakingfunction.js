//This function is used for validation to check the
import vdfg from "simple-vdf";
import SteamID from "steamid";
import SSH from "simple-ssh";
const { connect } = require("working-rcon");
import userModel from "../models/user";
import queueModel from "../models/queue";
import roomModel from "../models/room";
import joinForPlayModel from "../models/joinforplay";
import serverModel from "../models/server";
import { objectId } from "../functions/validations";
import { AllMaps, makeDb } from "../functions";
let ArrayOfTimers = [];

export const checkValidation5v5 = async ({
    tokenData: { userid },
    type: gamemode,
    premium: ispremium,
    advanced: ispremiumadvnaced,
    id: teamid,
}) => {
    try {
        console.log(objectId(userid));
        let errors = {};
        let isValid = true;
        let groupmembers;
        let teammembers;

        const alreadyExistInQueue = await queueModel.find({
            $and: [{ player: { $in: [objectId(userid)] } }, { queuetype: "5vs5" }, { valid: true }],
        });
        const { ispremium: premium, ispremiumadvnaced: advance, group, teams } = await userModel
            .findById(userid, {
                ispremium: 1,
                ispremiumadvnaced: 1,
                teams: 1,
                group: 1,
            })
            .populate({
                path: "teams",
                select: { joinedmembers: 1, invitedmembers: 1 },
                populate: { path: "joinedmembers", select: { online: 1, username: 1 } },
            })
            .populate({
                path: "group",
                select: { joinedmembers: 1, invitedmembers: 1, members: 1 },
                populate: { path: "joinedmembers", select: { online: 1, username: 1 } },
            })
            .lean();
        if (alreadyExistInQueue.length > 0) {
            errors.alreadyexist = "You already exist in the queue";
            isValid = false;
        }
        if (ispremium || ispremiumadvnaced) {
            if (!premium || !advance) {
                errors.noanymembership =
                    "You need to have premium/advance membership to compete with premum or advance players";
                isValid = false;
            }
        }

        if (gamemode === "team" || gamemode === "group") {
            if (gamemode === "group") {
                if (group) {
                    const { members } = group;
                    groupmembers = members.map((el) => el.user && el.user._id);
                    // if (joinedmembers.length < 5) {
                    //     errors.grouplengthnotfull = "Your group does't have 5 players to compete";
                    //     isValid = false;
                    // } else {
                    //     const checkAllOnline = joinedmembers.filter((el) => !el.online);
                    //     if (checkAllOnline.length > 0) {
                    //         errors.groupoffline = "Some group members are offline now";
                    //         isValid = false;
                    //     }
                    // }
                } else {
                    errors.groupnotexist = "Group does not exist";
                    isValid = false;
                }
            } else if (gamemode === "team") {
                const filterSelectedTeam = teams.filter(
                    (el) => el._id.toString() === teamid.toString()
                );
                if (filterSelectedTeam.length > 0) {
                    const { joinedmembers } = filterSelectedTeam[0];
                    teammembers = joinedmembers;

                    // if (joinedmembers.length < 5) {
                    //     errors.lengthnotfull = "Your team does't have 5 players to compete";
                    //     isValid = false;
                    // } else {
                    //     const checkAllOnline = joinedmembers.filter((el) => !el.online);
                    //     if (checkAllOnline.length > 0) {
                    //         console.log("checkAllOnline", checkAllOnline);
                    //         errors.offline = "Some team members are offline now";
                    //         isValid = false;
                    //     }
                    // }
                } else {
                    errors.teamnotexist = "Team not exist";
                    isValid = false;
                }
            }
        }
        return { isValid, errors, groupmembers, teammembers };
    } catch (e) {
        return e;
    }
};

export const sendResponse = (io, res, id) => {
    QueueFilter5vs5(io);
    res.send({ code: 200, msg: "You are successfully pushed in the queue", queueid: id });
};

const GetClosest = (data, to_find) =>
    data.reduce(({ averageelo, _id, player }, { averageelo: a, _id: id, player: user }) =>
        Math.abs(to_find - a) < Math.abs(to_find - averageelo)
            ? { averageelo: a, _id: id, player: user }
            : { averageelo, _id, player }
    );

export const QueueFilter5vs5 = async (io) => {
    try {
        let All5vs5Queue = await queueModel
            .find({
                $and: [
                    {
                        queuetype: "5vs5",
                    },
                    {
                        valid: true,
                    },
                ],
            })
            .populate({
                path: "player",
                select: {
                    useravatar: 1,
                    elo: 1,
                    username: 1,
                    steamid: 1,
                    prestige: 1,
                    ispremium: 1,
                    ispremiumadvnaced: 1,
                },
            })
            .lean();
        let fullfills = [];
        if (All5vs5Queue) {
            let All5vs5Queue5 = All5vs5Queue.filter((ele) => ele.player.length === 2).map((el) => {
                let average =
                    el.player.reduce((a, { prestige }) => a + prestige, 0) / el.player.length;
                el.averageelo = average;
                return el;
            });
            All5vs5Queue5.forEach((el, index, array) => {
                const filterFive = array.filter(
                    (element) =>
                        element._id.toString() !== el._id.toString() && element.player.length === 2
                );
                if (filterFive.length > 0) {
                    let Closest = GetClosest(filterFive, el.averageelo);
                    const { _id } = Closest;
                    const findIndex = array.findIndex(
                        (ind) => ind._id.toString() === _id.toString()
                    );
                    fullfills.push(el, Closest);
                    All5vs5Queue5.splice(index, 1);
                    All5vs5Queue5.splice(findIndex, 1);
                }
            });
            console.log("fullfills", fullfills);
            startWithSoloAndParty(fullfills, io, "matchmaking", "5vs5");
        }
    } catch (e) {
        return e;
    }
};

const createCaptain = (players, roomid, type) => {
    let { player } = players;
    const findIsPremiumAdvanced = player.sort((x, y) => y.ispremiumadvnaced - x.ispremiumadvnaced);
    const findIsPremium = player.sort((x, y) => y.ispremium - x.ispremium);
    const { ispremiumadvnaced } = findIsPremiumAdvanced[0];
    const { ispremium } = findIsPremium[0];
    if (ispremiumadvnaced) {
        let userArray = findIsPremiumAdvanced.map((el, i) => {
            let obj = {
                userid: el._id,
                jointype: type,
                roomid,
                iscaptain: i === 0 ? true : false,
            };
            return obj;
        });
        return userArray;
    } else if (ispremium) {
        let userArray = findIsPremium.map((el, i) => {
            let obj = {
                userid: el._id,
                jointype: type,
                roomid,
                iscaptain: i === 0 ? true : false,
            };
            return obj;
        });
        return userArray;
    } else {
        const filterByPrestige = player.sort((a, b) => b.prestige - a.prestige);
        let userArray = filterByPrestige.map((el, i) => {
            let obj = {
                userid: el._id,
                jointype: type,
                roomid,
                iscaptain: i === 0 ? true : false,
            };
            return obj;
        });
        return userArray;
    }
};

const createCaptain1vs1 = (players, roomid, type) => {
    let { player } = players;
    player = player.map((el, i) => {
        let obj = {
            userid: el._id,
            jointype: type,
            roomid,
            iscaptain: i === 0 ? true : false,
        };
        return obj;
    });
    return player;
};

const startWithSoloAndParty = async (allfullteams, io, type, gamemode) => {
    try {
        if (allfullteams.length >= 2) {
            let splice = allfullteams.splice(0, 2);
            let maps = await AllMaps(gamemode);
            //Here we create room for matchmaking team

            const createRoom = await roomModel.create({ gametype: type, maps, gamemode });

            let team1 =
                gamemode === "5vs5"
                    ? createCaptain(splice[0], createRoom._id, type)
                    : createCaptain1vs1(splice[0], createRoom._id, type);
            let team2 =
                gamemode === "5vs5"
                    ? createCaptain(splice[1], createRoom._id, type)
                    : createCaptain1vs1(splice[1], createRoom._id, type);

            console.log("team1, team2 =>>>", team1, team2);

            team1 = await joinForPlayModel.create(team1);
            team2 = await joinForPlayModel.create(team2);

            console.log("after team1, after team2 =>>>", team1, team2);

            createNotification([...team1, ...team2], createRoom._id.toString(), io);

            team1 = team1.map((el) => el._id);
            team2 = team2.map((el) => el._id);

            await roomModel.updateOne(
                { _id: createRoom._id },
                {
                    team1,
                    team2,
                }
            );
            let queueids = splice.map((el) => el._id);
            await queueModel.updateMany({ _id: { $in: queueids } }, { valid: false });
            checkJoindedTimer(createRoom._id.toString(), io, gamemode);

            startWithSoloAndParty(allfullteams, io, type, gamemode);
        } else {
            return false;
        }
    } catch (e) {
        console.log("startWithSoloAndParty =>>", e);
        return e;
    }
};

const createNotification = (playersArray, roomid, io) => {
    try {
        playersArray.forEach((el) => {
            io.in(el.userid.toString()).emit("GetNotifiyQueueFind", { roomid });
        });
    } catch (e) {
        console.log("createNotification =>>", e);
        return e;
    }
};

export const checkJoindedTimer = async (roomid, io, gamemode) => {
    try {
        let i = roomid;
        let timer = 30;
        i = setInterval(async () => {
            let id = roomid;
            try {
                if (timer >= 0) {
                    const roomdata = await roomModel
                        .findById(id, {
                            team1: 1,
                            team2: 1,
                        })
                        .populate({
                            path: "team1",
                            select: { ready: 1, iscaptain: 1 },
                            populate: {
                                path: "userid",
                                select: {
                                    username: 1,
                                    useravatar: 1,
                                },
                            },
                        })
                        .populate({
                            path: "team2",
                            select: { ready: 1, iscaptain: 1 },
                            populate: {
                                path: "userid",
                                select: {
                                    username: 1,
                                    useravatar: 1,
                                },
                            },
                        })
                        .lean();
                    if (roomdata) {
                        const { team1, team2 } = roomdata;
                        const teamArray = [...team1, ...team2];
                        const checkAllAccepted = teamArray.filter((el) => el.ready === false);
                        if (checkAllAccepted.length === 0) {
                            await roomModel.updateOne({ _id: id }, { mapvoting: "true" });
                            const joinedData = {
                                status: "AllAccepted",
                                roomid: id,
                                teamArray,
                                timer,
                                gamemode,
                            };
                            io.in(roomid).emit("CheckJoinedStatus", joinedData);
                            clearInterval(i);
                            const findIsCaptain = teamArray.filter((el) => el.iscaptain === true);
                            const {
                                userid: { _id },
                                username,
                            } = findIsCaptain[0];
                            console.log("userid username", _id, username);
                            PlayerMapPickTimer(id, _id, io, 60, gamemode);
                            // Here we Start PlayerMapPickTimer timer which used to check real time map ban
                        } else {
                            let joinedData = {
                                status: "NotAllAccepted",
                                roomid: id,
                                teamArray,
                                timer,
                                gamemode,
                            };
                            io.in(roomid).emit("CheckJoinedStatus", joinedData);
                        }
                    }
                } else {
                    let joinedData = {
                        status: "MissingAcceptAll",
                        roomid: id,
                        timer,
                        gamemode,
                    };
                    io.in(roomid).emit("CheckJoinedStatus", joinedData);
                    clearInterval(i);
                    RemoveRoomJoinedEtc(roomid);
                }
                timer--;
            } catch (e) {
                console.log("interval in error", e);
                clearInterval(i);
            }
        }, 1000);
    } catch (e) {
        console.log("check joined error", e);
    }
};

const RemoveRoomJoinedEtc = async (roomid) => {
    try {
        const { team1, team2 } = await roomModel.findById(roomid, { team1: 1, team2: 1 }).lean();
        const concatedArray = [...team1, ...team2];
        await joinForPlayModel.deleteMany({ _id: { $in: concatedArray } });
        await roomModel.deleteOne({ _id: roomid });
    } catch (e) {
        console.log("RemoveRoomJoinedEtc error =>>", e);
        return e;
    }
};

export const CheckInWhichTeamUserIs = async (roomid, userid) => {
    try {
        const roomData = await roomModel
            .findById(roomid, { team1: 1, team2: 1, gamemode: 1 })
            .populate({
                path: "team1",
            })
            .populate({
                path: "team2",
            })
            .lean();
        if (roomData) {
            const { team1, team2, gamemode } = roomData;
            let team;
            let captainCheck = false;
            const InTeam1 = team1.filter((el) => el.userid.toString() === userid.toString());
            const InTeam2 = team2.filter((el) => el.userid.toString() === userid.toString());
            if (InTeam1.length > 0) {
                const { iscaptain } = InTeam1[0];
                captainCheck = iscaptain;
                team = "teamone";
            } else if (InTeam2.length > 0) {
                const { iscaptain } = InTeam2[0];
                captainCheck = iscaptain;
                team = "teamtwo";
            } else {
                team = "teamone";
            }
            team = gamemode === "5vs5" ? team : "teamone";
            return { isValid: true, team, captainCheck, gamemode };
        } else {
            return { isValid: false, team: "", captainCheck: false, gamemode: "1vs1" };
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const PlayerMapPickTimer = async (roomid, playerid, io, timervalue, gamemode) => {
    try {
        console.log("gamemode =>>>>>", gamemode);
        let timer = parseInt(timervalue);
        let PickInterval = setInterval(async () => {
            const { maps, team1, team2, istournament } = await roomModel
                .findById(roomid)
                .populate({
                    path: "team1",
                    populate: {
                        path: "userid",
                        select: {
                            username: 1,
                            steamid: 1,
                        },
                    },
                })
                .populate({
                    path: "team2",
                    populate: {
                        path: "userid",
                        select: {
                            username: 1,
                            steamid: 1,
                        },
                    },
                })
                .lean();
            //Here filter last unbanned map
            const FilteredMaps = maps.filter((el) => el.open);
            if (FilteredMaps.length === 1) {
                const openServer = await serverModel
                    .findOne({
                        $and: [{ status: true }, { servertype: gamemode }],
                    })
                    .lean();
                if (openServer) {
                    console.log("find server ->>>>", openServer);
                    const { ip, port, rconpassword, sshuser, sshpassword } = openServer;
                    let portData = {
                        ip: ip,
                        port: port,
                        password: rconpassword,
                        sshuser: sshuser,
                        sshpassword: sshpassword,
                    };
                    let gameMap =
                        gamemode === "5vs5" ? FilteredMaps[0].title : FilteredMaps[0].mapid;
                    let afterTeam = null;
                    let playerarray = [];
                    let allPlayers = [...team1, ...team2];
                    console.log("here we need to call matchmaking start game function");
                    startGame(
                        allPlayers,
                        portData,
                        playerarray,
                        afterTeam,
                        roomid,
                        io,
                        gameMap,
                        gamemode
                    );
                    ClearTimer(roomid);
                } else {
                    console.log("come here no any server configuration find ");
                }
            } else {
                io.in(roomid).emit("PlayerPickTimer", { playerid, timer });
                console.log(ArrayOfTimers);
            }

            //Here Add a penalty on the user who did not pick a player in backword timer
            if (timer <= 0) {
                ClearTimer(roomid);
                //Here we checking the room is belongs to the tournament is yes then
                //we will not remove players from room becuase its tournament room
                if (!istournament) {
                    RemoveRoomJoinedEtc(roomid);
                }
                console.log("timer was cleared here");
                io.in(roomid).emit("HubGameCancelled", { roomid });
                // Here we need to call delete room and go to matchmaking page
            }
            timer--;
        }, 1000);
        ArrayOfTimers.push({ [roomid]: PickInterval });
    } catch (e) {
        console.log("error in the pick timer =>>>", e);
        ClearTimer(roomid);
    }
};

export const CheckPlayerMapPick = (roomid, playerid, io, gamemode) => {
    ClearTimer(roomid);
    PlayerMapPickTimer(roomid, playerid, io, 60, gamemode);
};

export const ClearTimer = (roomid) => {
    try {
        let filtered = [...ArrayOfTimers];
        let mydata = filtered.filter((el) => Object.keys(el)[0] == roomid);
        filtered = filtered.filter((el) => Object.keys(el)[0] !== roomid);
        clearInterval(Object.values(mydata[0])[0]);
        ArrayOfTimers = filtered;
    } catch (e) {
        console.log("error in clear timer =>>>", e);
        return e;
    }
};

const startGame = async (players, portData, playerarray, afterTeam, roomid, io, map, gamemode) => {
    try {
        console.log("port from function", portData);
        let staemids1vs1 = [];
        let rcon = await connect(
            portData.ip.toString(),
            parseInt(portData.port),
            portData.password,
            5000
        );
        await rcon.command("sm plugins reload assignteams.smx");
        console.log("plugin1 reloaded");
        await rcon.command("sm plugins reload WarmupCheck.smx");
        console.log("plugin2 reloaded");
        players.forEach(async (player, i) => {
            staemids1vs1.push(player.userid.steamid);
            let sid = new SteamID(player.userid.steamid);
            let newsid = '"' + sid.getSteam2RenderedID(true).toString() + '"';
            console.log("sm_whitelist_add" + " " + newsid);
            let lengthChk = gamemode === "5vs5" ? 2 : 1;
            // const playerSlot = player.playerslot
            if (i < lengthChk) {
                console.log("username", player.userid.username + " " + "team", "T");
                afterTeam = "CS_TEAM_T";
            } else if (i >= lengthChk) {
                console.log("username", player.userid.username + " " + "team", "CT");
                afterTeam = "CS_TEAM_CT";
            }
            let newsid1 = sid.getSteam2RenderedID(true);
            playerarray.push({
                [newsid1]: {
                    [newsid1]: afterTeam,
                },
            });
            await rcon.command("sm_whitelist_add" + " " + newsid);
            console.log("whitelisted");
        });
        await rcon.command("tv_enable 0");

        /** This block always commented */
        // await rcon.command('tv_delay 30');
        // await rcon.command('tv_advertise_watchable 1');
        // await rcon.command(`sm_record_name ${roomid}`);
        /** --------------------- */

        if (gamemode === "5vs5") {
            await rcon.command(`changelevel ${map}`);
        } else if (gamemode === "1vs1") {
            await rcon.command(`host_workshop_map ${parseInt(map)}`);
        }

        console.log("disconecting rcon");

        await rcon.disconnect();

        console.log("map changed");

        let str1 = "'" + '"base"' + "{";

        playerarray.forEach(function (el) {
            str1 += vdfg.stringify(el);
        });

        let newstr = str1 + "}" + "'";

        console.log(portData);

        const ssh = new SSH({
            host: portData.ip,
            user: portData.sshuser,
            pass: portData.sshpassword,
        });

        console.log("newstrrrr=>>>>>>", newstr);
        await ssh
            .exec(
                `cd ../../home/steam/csgo-ds/csgo/addons/sourcemod/data/text && printf ${newstr}  > assignteams.txt`,
                {
                    out: function (stdout) {
                        console.log("stdout", stdout);
                    },
                }
            )
            .start();
        let configuredData = portData.ip.toString() + ":" + portData.port;
        await roomModel.updateOne({ _id: roomid }, { joinip: configuredData });
        io.in(roomid).emit("SetHubsIP", { ip: configuredData });
        const rconv = Math.random();
        if (gamemode === "5vs5") {
            IntervalFunctionForUpdateID(
                portData.ip.toString(),
                rconv,
                portData.port,
                portData.password,
                roomid,
                io
            );
        } else if (gamemode === "1vs1") {
            console.log("here we can start 1vs1 functions for stats tracking");
            PreMatchStatsByRankme(staemids1vs1[0], staemids1vs1[1]);
            IntervalFunction1vs1Stats(
                portData.ip.toString(),
                rconv,
                portData.port,
                portData.password,
                roomid,
                io
            );
            //Here
        }
    } catch (e) {
        console.log("error in the start game section..", e);
        io.in(roomid).emit("HubsErrorOccured", "Cannot connect to server, please try again later.");
    }
};

const IntervalFunctionForUpdateID = async (rconip, rconvar, port, rconpassword, id, io) => {
    //This function is used for check the connected people on the server for store mongodb id in the mysql database for fetch the stats of the game kill,deths etc....
    console.log("Second Interval function fired");
    let i = id;
    let db;
    try {
        i = setInterval(async () => {
            let rcon = rconvar;
            try {
                rcon = await connect(rconip, parseInt(port), rconpassword, 5000);
                const status = await rcon.command("status");
                console.log("Joined player status", status);
                if (status.includes("2 humans")) {
                    db = makeDb("5vs5");
                    let { team1 } = await roomModel
                        .findById(id, {
                            team1: 1,
                        })
                        .populate({
                            path: "team1",
                            populate: {
                                path: "userid",
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
                    console.log("Data found for rows =>>>>", someRows);
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
                            console.log("query fired data updated");
                        }
                    } else {
                        console.log("not some someRows");
                        db.close();
                    }
                }
                await rcon.disconnect();
            } catch (err1) {
                console.log("Here first catch block", err1);
                db.close();
                clearInterval(i);
            }
        }, 120000);
    } catch (err2) {
        console.log("Here second catch block", err2);
        db.close();
        clearInterval(i);
    }
};
const IntervalFunctionForGetStats = async (rconip, rconvar, port, rconpassword, id, io) => {
    let i = rconip;
    let db;
    try {
        i = setInterval(async () => {
            let rcon = rconvar;
            try {
                rcon = await connect(rconip, parseInt(port), rconpassword, 5000);
                const status = await rcon.command("status");
                console.log("status", status);
                if (status.includes("0 humans")) {
                    db = makeDb("5vs5");
                    let { team1, team2 } = await roomModel
                        .findById(id, {
                            userid: 1,
                        })
                        .populate({
                            path: "team1",
                            populate: {
                                path: "userid",
                                select: {
                                    steamid: 1,
                                },
                            },
                        })
                        .populate({
                            path: "team2",
                            populate: {
                                path: "userid",
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
                                    el.t_name === "Counter-Terrorists" &&
                                    el.ct_name === "Terrorists"
                                ) {
                                    if (el.ct_overall_score === el.t_overall_score) {
                                        el.result = "draw";
                                        el.points = 3;
                                    } else if (el.ct_overall_score > el.t_overall_score) {
                                        el.result = "win";
                                        el.points = 5;
                                    } else {
                                        el.result = "loss";
                                        el.points = -5;
                                    }
                                } else if (
                                    el.team === 1 &&
                                    el.t_name === "Terrorists" &&
                                    el.ct_name === "Counter-Terrorists"
                                ) {
                                    if (el.ct_overall_score === el.t_overall_score) {
                                        el.result = "draw";
                                        el.points = 3;
                                    } else if (el.t_overall_score > el.ct_overall_score) {
                                        el.result = "win";
                                        el.points = 5;
                                    } else {
                                        el.result = "loss";
                                        el.points = -5;
                                    }
                                } else if (
                                    el.team === 2 &&
                                    el.t_name === "Counter-Terrorists" &&
                                    el.ct_name === "Terrorists"
                                ) {
                                    if (el.ct_overall_score === el.t_overall_score) {
                                        el.result = "draw";
                                        el.points = 3;
                                    } else if (el.t_overall_score > el.ct_overall_score) {
                                        el.result = "win";
                                        el.points = 5;
                                    } else {
                                        el.result = "loss";
                                        el.points = -5;
                                    }
                                } else if (
                                    el.team === 2 &&
                                    el.t_name === "Terrorists" &&
                                    el.ct_name === "Counter-Terrorists"
                                ) {
                                    if (el.ct_overall_score === el.t_overall_score) {
                                        el.result = "draw";
                                        el.points = 3;
                                    } else if (el.ct_overall_score > el.t_overall_score) {
                                        el.result = "win";
                                        el.points = 5;
                                    } else {
                                        el.result = "loss";
                                        el.points = -5;
                                    }
                                }
                                const { userid } = filterFromPlayer[0];
                                await joinForPlayModel.updateOne(
                                    {
                                        roomid: objectId(id),
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
                                            prestige: el.points,
                                        },
                                    }
                                );
                            }
                        });
                        await roomModel.updateOne(
                            {
                                _id: id,
                            },
                            {
                                running: false,
                            }
                        );
                        await joinForPlayModel.updateMany(
                            {
                                roomid: objectId(id),
                            },
                            {
                                running: false,
                            }
                        );
                    }
                    db.close();
                    io.in(id).emit("resetRoom");
                    clearInterval(i);
                    console.log("clearing interval", "ip is", rconip, "port is", port);
                }
                await rcon.disconnect();
            } catch (e) {
                console.log("error in the inter function first", e);
                db.close();
                io.in(id).emit("resetRoom");
                clearInterval(i);
            }
            //19000
            //180000
        }, 180000);
    } catch (e) {
        console.log("error in the inter function last", e);
        db.close();
        io.in(id).emit("resetRoom");
        clearInterval(i);
    }
};

/**
 * Here we started 1vs1 matchmaking system here we are building re-useable
 * function which are used to simplify the statructure of the code
 */

export const checkValidation1vs1 = async ({
    userid,
    premium: reqpremium,
    advanced: reqadvance,
}) => {
    try {
        let errors = {};
        let isValid = true;
        reqpremium = reqpremium.toString();
        reqadvance = reqadvance.toString();
        const alreadyExistInQueue = await queueModel.find({
            $and: [{ player: { $in: [objectId(userid)] } }, { queuetype: "1vs1" }, { valid: true }],
        });
        let { ispremium, ispremiumadvnaced } = await userModel
            .findById(userid, {
                ispremium: 1,
                ispremiumadvnaced: 1,
            })
            .lean();
        ispremium = ispremium.toString();
        ispremiumadvnaced = ispremiumadvnaced.toString();
        // console.log(ispremium, ispremiumadvnaced);

        if (alreadyExistInQueue.length > 0) {
            errors.alreadyexist = "You already exist in the queue";
            isValid = false;
        }
        // if (reqpremium === "true" || reqadvance === "true") {
        //     if (
        //         reqpremium === "true" &&
        //         ispremium === "false" &&
        //         reqadvance === "false" &&
        //         ispremiumadvnaced === "false"
        //     ) {
        //         //return error
        //         errors.premium =
        //             "You need to have premium membership to compete with premium players";
        //         isValid = false;
        //     } else if (
        //         reqadvance === "true" &&
        //         ispremiumadvnaced === "false" &&
        //         reqpremium === "false" &&
        //         ispremium === "false"
        //     ) {
        //         errors.advance =
        //             "You need to have advance membership to compete with advance players";
        //         isValid = false;
        //         //return error
        //     } else if (
        //         reqadvance === "true" &&
        //         ispremiumadvnaced === "false" &&
        //         reqpremium === "true" &&
        //         ispremium === "true"
        //     ) {
        //         errors.both =
        //             "You need to premium and advance membership to compete with premium and advance players";
        //         isValid = false;
        //         //
        //     } else if (
        //         reqadvance === "true" &&
        //         ispremiumadvnaced === "true" &&
        //         reqpremium === "true" &&
        //         ispremium === "false"
        //     ) {
        //         errors.both =
        //             "You need to premium and advance membership to compete with premium and advance players";
        //         isValid = false;
        //         //
        //     }
        // }
        return { isValid, errors };
    } catch (e) {
        return e;
    }
};

export const QueueFilter1vs1 = async (io) => {
    try {
        let All1vs1Queue = await queueModel
            .find({
                $and: [
                    {
                        queuetype: "1vs1",
                    },
                    {
                        valid: true,
                    },
                ],
            })
            .populate({
                path: "player",
                select: {
                    useravatar: 1,
                    elo: 1,
                    username: 1,
                    steamid: 1,
                    prestige1vs1: 1,
                    ispremium: 1,
                    ispremiumadvnaced: 1,
                },
            })
            .lean();
        let fullfills = [];
        if (All1vs1Queue) {
            All1vs1Queue = All1vs1Queue.map((el) => {
                let average = el.player.reduce((a, { prestige1vs1 }) => a + prestige1vs1, 0);
                el.averageelo = average;
                return el;
            });
            All1vs1Queue.forEach((el, index, array) => {
                array = array.filter((ele) => ele._id.toString() !== el._id.toString());
                if (array.length > 0) {
                    let Closest = GetClosest(array, el.averageelo);
                    console.log("Closest", Closest);
                    const { _id } = Closest;
                    const findIndex = array.findIndex(
                        (ind) => ind._id.toString() === _id.toString()
                    );
                    fullfills.push(el, Closest);
                    All1vs1Queue.splice(index, 1);
                    All1vs1Queue.splice(findIndex, 1);
                }
            });
            startWithSoloAndParty(fullfills, io, "matchmaking1vs1", "1vs1");
        }
    } catch (e) {
        return e;
    }
};

export const PreMatchStatsByRankme = async (steamid1, steamid2) => {
    let db;
    try {
        console.log("Pre match stats both ids", steamid1, steamid2);
        db = makeDb("1vs1");
        const PrePlayers = await db.query(
            "select * from rankme where steam = '" +
                convertSteamIdTo32(steamid1) +
                "' or steam = '" +
                convertSteamIdTo32(steamid2) +
                "'"
        );
        if (PrePlayers.length > 0) {
            PrePlayers.forEach(async (el) => {
                const { steam } = el;
                console.log(convertSteamIdTo64(steam));
                await userModel.updateOne(
                    { steamid: convertSteamIdTo64(steam) },
                    {
                        old1vs1stats: el,
                    }
                );
            });
        }
    } catch (error) {
        db.close();
        return error;
    }
};

export const PostMatchStatsByRankme = async (team1, team2) => {
    let db;
    try {
        db = makeDb("1vs1");
        const {
            team1: {
                userid: { steamid: steamid1 },
            },
            team2: {
                userid: { steamid: steamid2 },
            },
        } = { team1: team1[0], team2: team2[0] };
        const PlayersNewStats = await db.query(
            "select * from rankme where steam = '" +
                convertSteamIdTo32(steamid1) +
                "' or steam = '" +
                convertSteamIdTo32(steamid2) +
                "'"
        );
        if (PlayersNewStats.length > 0) {
            let PlayerStats = [];
            PlayersNewStats.forEach(async (el) => {
                const { steam } = el;
                const GamePlayers = [...team1, ...team2].filter(
                    (element) => element.userid.steamid == convertSteamIdTo64(steam)
                );
                if (GamePlayers.length > 0) {
                    const {
                        userid: { old1vs1stats },
                        _id,
                    } = GamePlayers[0];
                    if (old1vs1stats) {
                        let statsData = CompareAndGetStats(
                            old1vs1stats,
                            el,
                            convertSteamIdTo64(steam),
                            _id
                        );
                        PlayerStats.push(statsData);
                    } else {
                        const { ct_win, tr_win, kills, deaths, headshots } = el;
                        PlayerStats.push({
                            ct_win,
                            tr_win,
                            kills,
                            deaths,
                            headshots,
                            steamid: convertSteamIdTo64(steam),
                            _id,
                        });
                    }
                }
            });
            UpdateStatsInDbAfterFindWinner(PlayerStats);
        }
    } catch (error) {
        db.close();
        return error;
    }
};
const CompareAndGetStats = (oldStats, newStats, steamid, _id) => {
    let {
        ct_win: ct_win_old,
        tr_win: tr_win_old,
        kills: kills_old,
        deaths: deaths_old,
        headshots: headshots_old,
    } = oldStats;
    let {
        ct_win: ct_win_new,
        tr_win: tr_win_new,
        kills: kills_new,
        deaths: deaths_new,
        headshots: headshots_new,
    } = newStats;
    let oldRounds = ct_win_old + tr_win_old;
    let newRounds = ct_win_new + tr_win_new;
    let newKills = kills_new - kills_old;
    let newDeaths = deaths_new - deaths_old;
    let overallRounds = newRounds - oldRounds;
    let newHeadShots = headshots_new - headshots_old;

    let statsData = {
        kills: newKills,
        rounds: overallRounds,
        deaths: newDeaths,
        headshots: newHeadShots,
        steamid,
        _id,
    };
    return statsData;
};

const UpdateStatsInDbAfterFindWinner = async (stats) => {
    try {
        const FindWinner = stats.map((el, i, array) => {
            const NotEqual = array.filter((ele) => ele.steamid !== el.steamid);
            if (NotEqual.length > 0) {
                const { rounds } = NotEqual[0];
                if (el.rounds > rounds) {
                    el.result = "win";
                    el.t_overall_score = el.rounds;
                    el.ct_overall_score = rounds;
                    el.points = 8;
                } else if (el.rounds === rounds) {
                    el.result = "draw";
                    el.t_overall_score = el.rounds;
                    el.ct_overall_score = rounds;
                    el.points = 4;
                } else {
                    el.result = "loss";
                    el.t_overall_score = rounds;
                    el.ct_overall_score = el.rounds;
                    el.points = -8;
                }
            }
            return el;
        });

        for (let key in FindWinner) {
            await joinForPlayModel.updateOne(
                {
                    _id: FindWinner[key]._id,
                },
                {
                    result: FindWinner[key],
                    running: false,
                }
            );
            await userModel.updateOne(
                {
                    steamid: FindWinner[key].steamid,
                },
                {
                    $inc: {
                        prestige1vs1: FindWinner[key].points,
                    },
                }
            );
        }
    } catch (error) {
        return error;
    }
};

const convertSteamIdTo32 = (steamid) => {
    let si1 = new SteamID(steamid);
    return si1.getSteam2RenderedID(true);
};

const convertSteamIdTo64 = (steamid) => {
    let si1 = new SteamID(steamid);
    return si1.getSteamID64(true);
};

const IntervalFunction1vs1Stats = async (rconip, rconvar, port, rconpassword, id, io) => {
    console.log("1vs1 Interval Function is fired");
    let i = id;
    try {
        i = setInterval(async () => {
            let rcon = rconvar;
            try {
                rcon = await connect(rconip, parseInt(port), rconpassword, 5000);
                const status = await rcon.command("status");
                console.log("Stil checking for two players after 1vs1 match start");
                if (status.includes("2 humans")) {
                    IntervalFunction1vs1StatsCompleteGame(
                        rconip,
                        rconvar,
                        port,
                        rconpassword,
                        id,
                        io
                    );
                    clearInterval(i);
                }
                await rcon.disconnect();
            } catch (err1) {
                console.log("1vs1 first catch block", err1);
                clearInterval(i);
            }
        }, 120000);
    } catch (err2) {
        console.log("Here second catch block", err2);
        clearInterval(i);
    }
};

const IntervalFunction1vs1StatsCompleteGame = async (
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
                const status = await rcon.command("status");
                console.log("status =>>> 1vs1 running match stats waiting =>>", status);
                if (status.includes("0 humans")) {
                    db = makeDb("1vs1");
                    let { team1, team2 } = await roomModel
                        .findById(id, {
                            userid: 1,
                        })
                        .populate({
                            path: "team1",
                            populate: {
                                path: "userid",
                                select: {
                                    steamid: 1,
                                    old1vs1stats: 1,
                                },
                            },
                        })
                        .populate({
                            path: "team2",
                            populate: {
                                path: "userid",
                                select: {
                                    steamid: 1,
                                    old1vs1stats: 1,
                                },
                            },
                        })
                        .lean();
                    PostMatchStatsByRankme(team1, team2);
                    await roomModel.updateOne({ _id: id }, { running: false });
                    db.close();
                    io.in(id).emit("resetRoom");
                    clearInterval(i);
                }
                await rcon.disconnect();
            } catch (e) {
                console.log("error in the inter function first", e);
                db.close();
                io.in(id).emit("resetRoom");
                clearInterval(i);
            }
            //19000
            //180000
        }, 180000);
    } catch (e) {
        console.log("error in the inter function last", e);
        db.close();
        io.in(id).emit("resetRoom");
        clearInterval(i);
    }
};
