import tournamentModel from "../models/tournament";
import { FetchObject, roomLevels, LevelsArray, ForChangeRoomLevel } from "../config/config";
import { GetEasyArray } from "./validations";
import { AllMaps } from "./";
import roomModel from "../models/room";
import joinForPlayModel from "../models/joinforplay";

export const StartCheckAnNotifyMembers = async (tournamentData, io) => {
    /** In this function we need to notify all the members there tournament going to start please complete check-in process and confirm there availabilty */
    try {
        const { gameType, _id } = tournamentData;
        const { playerJoined } = await tournamentModel
            .findById(_id, {
                title: 1,
                playerNumbers: 1,
                playerJoined: 1,
            })
            .populate(FetchObject(gameType))
            .lean();
        GetTeamsOr1vs1PlayersAccordingToModel(playerJoined, gameType, io, _id);
        const PlayersArray = GetEasyArray(playerJoined);
        NotifyAllplayersTournamentGoingTostart(PlayersArray, io, _id);
        return true;
    } catch (error) {
        console.log(error);
        return error;
    }
};
const NotifyAllplayersTournamentGoingTostart = (PlayersArray, io, tournaId) => {
    PlayersArray.forEach((element) => {
        io.in(element._id.toString()).emit("GetNotifyEventTournament", tournaId);
    });
};
//This function is used to checked the joined members are joned by team or single
const GetTeamsOr1vs1PlayersAccordingToModel = (playerJoined, gameType, io, tournaId) => {
    if (gameType === "1vs1") {
        const findPlayers = playerJoined
            .filter((el) => el.onModel === "users")
            .map((el) => el.UserOrTeam);
        if (findPlayers.length > 0) {
            CreateRoomLevel1vs1(findPlayers, findPlayers.length, io, 0, tournaId);
        }
    } else if (gameType === "5vs5") {
        const findPlayers = playerJoined
            .filter((el) => el.onModel === "team")
            .map((el) => el.UserOrTeam);
        if (findPlayers.length > 0) {
            CreateRoomLevel5v5(findPlayers, findPlayers.length, io, 0, tournaId);
        }
    } else {
        return false;
    }
};
//This function is used to create 5v5 match levels
const CreateRoomLevel5v5 = async (teams, length, io, level, tournaId) => {
    try {
        if (length > 1) {
            //Here we devided the players/teams length -
            let newlength = length / 2;
            // Here we get the rooms accotding to the new lwngth -
            const RoomsData = await CreateRoomAccordigToLength(
                newlength,
                "tournament5vs5",
                "5vs5",
                tournaId
            );
            //Here we created rooms with RoomsData which is return by CreateRoomAccordigToLength function -
            let createroom = await roomModel.create(RoomsData);
            createroom = createroom.map((el) => el._id);
            const getLevel = roomLevels[`${level}`];
            //Here we updated the tournament room levels -
            await tournamentModel.updateOne({ _id: tournaId }, { [getLevel]: createroom });
            //Here we incremented the level
            level++;
            //here we call again this function with new length and level
            await CreateRoomLevel5v5(teams, newlength, io, level, tournaId);
        } else {
            const { roomsLevelOne } = await tournamentModel.findByIdAndUpdate(
                tournaId,
                { tournamentStarted: true },
                { new: true }
            );
            Put5vs5PlayerInLevelOne(teams, roomsLevelOne, "tournament5vs5");
            return false;
        }
    } catch (error) {
        return false;
    }
};
//This function is used to create 1vs1 match levels
const CreateRoomLevel1vs1 = async (teams, length, io, level, tournaId) => {
    try {
        if (length > 1) {
            //Here we devided the players/teams length -
            let newlength = length / 2;
            // Here we get the rooms accotding to the new lwngth -
            const RoomsData = await CreateRoomAccordigToLength(
                newlength,
                "tournament1vs1",
                "1vs1",
                tournaId
            );
            //Here we created rooms with RoomsData which is return by CreateRoomAccordigToLength function -
            let createroom = await roomModel.create(RoomsData);
            createroom = createroom.map((el) => el._id);
            const getLevel = roomLevels[`${level}`]; //get level from roomLevels object according to length -
            //Here we updated the tournament room levels -
            await tournamentModel.updateOne({ _id: tournaId }, { [getLevel]: createroom });
            //Here we incremented the level
            level++;
            //here we call again this function with new length and level
            await CreateRoomLevel1vs1(teams, newlength, io, level, tournaId);
        } else {
            //Here we updated the tournament status and getting rooms level 1 for place the players in the level 1-
            const { roomsLevelOne } = await tournamentModel.findByIdAndUpdate(
                tournaId,
                { tournamentStarted: true },
                { new: true }
            );
            Put1vs1PlayerInLevelOne(teams, roomsLevelOne, "tournament1vs1");
            return false;
        }
    } catch (error) {
        return false;
    }
};

const CreateRoomAccordigToLength = async (newlength, gametype, gamemode, tournamentid) => {
    const maps = await AllMaps(gamemode);
    let rooms = [];
    let roomData = { maps, gametype, gamemode, tournamentid, istournament: true };
    for (let i = 1; i <= newlength; i++) {
        rooms.push(roomData);
    }
    return rooms;
};

const Put1vs1PlayerInLevelOne = async (players, rooms, type) => {
    try {
        if (players.length > 0 && rooms.length > 0) {
            const slicePlayer = players.splice(0, 2);
            const sliceRoom = rooms.splice(0, 1);
            //Here We creating the 1vs1 captain
            let team1 = createCaptain1vs1([slicePlayer[0]], sliceRoom[0], type);
            let team2 = createCaptain1vs1([slicePlayer[1]], sliceRoom[0], type);
            //Here we creating join for play model data its a global stats collection
            team1 = await joinForPlayModel.create(team1);
            team2 = await joinForPlayModel.create(team2);
            team1 = team1.map((el) => el._id);
            team2 = team2.map((el) => el._id);
            //Updating the tournament room with players
            await roomModel.updateOne(
                { _id: sliceRoom[0] },
                {
                    team1,
                    team2,
                }
            );
            //Here we call recursive function with new spliced data
            Put1vs1PlayerInLevelOne(players, rooms, type);
            //Here we need call there tournament going to be start ----
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

const Put5vs5PlayerInLevelOne = async (players, rooms, type) => {
    try {
        if (players.length > 0 && rooms.length > 0) {
            const slicePlayer = players.splice(0, 2);
            const sliceRoom = rooms.splice(0, 1);
            //Here We creating the 1vs1 captain
            console.log("slicePlayer 5v5 =>>", slicePlayer, "sliceRoom 5v5=>>", sliceRoom);
            let team1 = createCaptain5vs5(slicePlayer[0].joinedmembers, sliceRoom[0], type);
            let team2 = createCaptain5vs5(slicePlayer[1].joinedmembers, sliceRoom[0], type);
            //Here we creating join for play model data its a global stats collection
            team1 = await joinForPlayModel.create(team1);
            team2 = await joinForPlayModel.create(team2);
            team1 = team1.map((el) => el._id);
            team2 = team2.map((el) => el._id);
            //Updating the tournament room with players
            await roomModel.updateOne(
                { _id: sliceRoom[0] },
                {
                    team1,
                    team2,
                }
            );
            Put5vs5PlayerInLevelOne(players, rooms);
            //Here we need call there tournament going to be start ----
        } else {
            return false;
        }
    } catch (error) {
        return error;
    }
};

// This function is used to create 1vs1 tournament captain -
const createCaptain1vs1 = (players, roomid, type) => {
    let player = players.map((el, i) => {
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

// This function is used to find the captain in 5v5 tournament match
const createCaptain5vs5 = (player, roomid, type) => {
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

// This data for test the 1vs1 tournament
/**
 * Loss {
    "kills" : 3,
    "rounds" : 3,
    "deaths" : 16,
    "headshots" : 2,
    "steamid" : "76561199104108391",
    "_id" : ObjectId("5fa26d16d61f7529a9abd1b5"),
    "result" : "loss",
    "t_overall_score" : 16,
    "ct_overall_score" : 3,
    "points" : -8
} */

/**
 *Win {
    "kills" : 16,
    "rounds" : 16,
    "deaths" : 3,
    "headshots" : 14,
    "steamid" : "76561199104108391",
    "_id" : ObjectId("5f6df905f3efed129c0597ab"),
    "result" : "win",
    "t_overall_score" : 16,
    "ct_overall_score" : 3,
    "points" : 8
}
 */

// This data for test the 5vs5 tournament -
/**
 *Loss {
    "match_id" : 3,
    "match_start" : ISODate("2020-10-17T12:58:04.000Z"),
    "match_end" : ISODate("2020-10-17T13:13:57.000Z"),
    "map" : "de_mirage",
    "max_rounds" : 15,
    "overtime_max_rounds" : 3,
    "overtime_count" : 0,
    "played_out" : 0,
    "t_name" : "Counter-Terrorists",
    "t_overall_score" : 2,
    "t_first_half_score" : 2,
    "t_second_half_score" : 0,
    "t_overtime_score" : 0,
    "ct_name" : "Terrorists",
    "ct_overall_score" : 16,
    "ct_first_half_score" : 13,
    "ct_second_half_score" : 3,
    "ct_overtime_score" : 0,
    "demo" : "2020-10-17-1258-6988-de_mirage",
    "type" : "5f8ae5b70635805908fe833f",
    "key_id" : 5,
    "rounds_played" : 18,
    "player_name" : "hari",
    "steam_id_64" : "76561198813289464",
    "team" : 2,
    "kills" : 1,
    "deaths" : 9,
    "assists" : 0,
    "head_shots" : 0,
    "team_kills" : 0,
    "assists_team_attack" : 0,
    "damage" : 100,
    "hits" : 4,
    "shots" : 0,
    "last_alive" : 17,
    "clutch_won" : 2,
    "1k" : 1,
    "2k" : 0,
    "3k" : 0,
    "4k" : 0,
    "5k" : 0,
    "result" : "loss"
}
Win {
    "match_id" : 2,
    "match_start" : ISODate("2020-10-16T07:09:43.000Z"),
    "match_end" : ISODate("2020-10-16T07:25:01.000Z"),
    "map" : "de_mirage",
    "max_rounds" : 15,
    "overtime_max_rounds" : 3,
    "overtime_count" : 0,
    "played_out" : 0,
    "t_name" : "Counter-Terrorists",
    "t_overall_score" : 1,
    "t_first_half_score" : 1,
    "t_second_half_score" : 0,
    "t_overtime_score" : 0,
    "ct_name" : "Terrorists",
    "ct_overall_score" : 16,
    "ct_first_half_score" : 14,
    "ct_second_half_score" : 2,
    "ct_overtime_score" : 0,
    "demo" : "2020-10-16-0709-6988-de_mirage",
    "type" : "5f89436b284a111f62e0fe47",
    "key_id" : 4,
    "rounds_played" : 17,
    "player_name" : "test1",
    "steam_id_64" : "76561198884721329",
    "team" : 1,
    "kills" : 15,
    "deaths" : 1,
    "assists" : 0,
    "head_shots" : 15,
    "team_kills" : 0,
    "assists_team_attack" : 0,
    "damage" : 1500,
    "hits" : 17,
    "shots" : 0,
    "last_alive" : 16,
    "clutch_won" : 15,
    "1k" : 15,
    "2k" : 0,
    "3k" : 0,
    "4k" : 0,
    "5k" : 0,
    "result" : "win",
    "points" : 5
}
 */
export const TournamentDataFetch = async (tournamentid, status) => {
    try {
        const fromUser = {
            path: "userid",
            select: { username: 1, useravatar: 1, prestige: 1, prestige1vs1: 1 },
        };
        const tournamentData = await tournamentModel
            .findById(tournamentid, {
                roomsLevelOne: 1,
                roomsLevelTwo: 1,
                roomsLevelThree: 1,
                roomsLevelFour: 1,
                roomsLevelFive: 1,
                roomsLevelSix: 1,
            })
            .populate({
                path: "roomsLevelOne",
                match: { running: status },
                populate: { path: "team1", populate: fromUser },
            })
            .populate({
                path: "roomsLevelOne",
                match: { running: status },
                populate: { path: "team2", populate: fromUser },
            })
            .populate({
                path: "roomsLevelTwo",
                match: { running: status },
                populate: { path: "team1", populate: fromUser },
            })
            .populate({
                path: "roomsLevelTwo",
                match: { running: status },
                populate: { path: "team2", populate: fromUser },
            })
            .populate({
                path: "roomsLevelThree",
                match: { running: status },
                populate: { path: "team1", populate: fromUser },
            })
            .populate({
                path: "roomsLevelThree",
                match: { running: status },
                populate: { path: "team2", populate: fromUser },
            })
            .populate({
                path: "roomsLevelFour",
                match: { running: status },
                populate: { path: "team1", populate: fromUser },
            })
            .populate({
                path: "roomsLevelFour",
                match: { running: status },
                populate: {
                    path: "team2",
                    populate: fromUser,
                },
            })
            .populate({
                path: "roomsLevelFive",
                match: { running: status },
                populate: { path: "team1", populate: fromUser },
            })
            .populate({
                path: "roomsLevelFive",
                match: { running: status },
                populate: { path: "team2", populate: fromUser },
            })
            .populate({
                path: "roomsLevelSix",
                match: { running: status },
                populate: { path: "team1", populate: fromUser },
            })
            .populate({
                path: "roomsLevelSix",
                match: { running: status },
                populate: { path: "team2", populate: fromUser },
            })
            .lean();
        return tournamentData;
    } catch (e) {
        return e;
    }
};

export const InWhichRoomTeamUserIs = async (tournamentid, userid, status) => {
    try {
        let roomLevel = "";
        let roomidData = "";
        let captainCheck = false;
        const tournamentData = await TournamentDataFetch(tournamentid, status);
        LevelsArray.forEach((element) => {
            tournamentData[element].forEach((el) => {
                const { team1, team2, _id: roomid } = el;
                const concatedArray = [...team1, ...team2];
                const isExist = concatedArray.filter(
                    (ele) => ele.userid._id.toString() === userid.toString()
                );
                if (isExist.length > 0) {
                    const { iscaptain } = isExist[0];
                    roomLevel = element;
                    roomidData = roomid;
                    captainCheck = iscaptain;
                }
            });
        });
        return { roomLevel, roomidData, captainCheck };
    } catch (error) {
        return error;
    }
};
//Get next round roomid
const GetNextRoundRoomId = async (tournamentid, userid) => {
    try {
        let team = null;
        let nextroomid = null;
        const { roomLevel } = await InWhichRoomTeamUserIs(tournamentid, userid, false);
        const nextRoom = ForChangeRoomLevel[roomLevel];
        const getOpenSlots = await tournamentModel
            .findById(tournamentid, { [nextRoom]: 1 })
            .populate({
                path: nextRoom,
                populate: { path: "team2" },
            })
            .populate({
                path: nextRoom,
                populate: { path: "team1" },
            });
        getOpenSlots[nextRoom].some((el) => {
            const { team1, team2, _id } = el;
            if (team1.length <= 0) {
                team = "team1";
                nextroomid = _id;
                return true;
            } else if (team2.length <= 0) {
                team = "team2";
                nextroomid = _id;
                return true;
            }
        });
        return { team, nextroomid };
    } catch (error) {
        return error;
    }
};
const calculateWinner1vs1 = async (team1, team2, roomid, tournamentid) => {
    const cocatedArray = [...team1, ...team2];
    const winnerIs = cocatedArray.filter((el) => el.result.result === "win");
    if (winnerIs.length > 0) {
        const {
            jointype,
            userid: { _id },
        } = winnerIs[0];
        if (jointype === "tournament1vs1") {
            const { nextroomid, team } = await GetNextRoundRoomId(tournamentid, _id);
            const playerArray = [{ _id }];
            let teamData = createCaptain1vs1(playerArray, nextroomid, jointype);
            console.log(teamData);
            //Here we creating join for play model data its a global stats collection
            teamData = await joinForPlayModel.create(teamData);
            teamData = teamData.map((el) => el._id);
            //Updating the tournament room with players
            await roomModel.updateOne(
                { _id: nextroomid },
                {
                    [team]: teamData,
                }
            );
            //Here we need to write code to place user with next room after join play creation -
        }
    }
};

// This function is used to send a player to the next rounds
// This function called from user route for test the tournament things -
// When it will work. we call this function form game end function form both 1vs1 and 5vs5 -

export const SendPlayerToNextRound = async (roomid) => {
    try {
        const { team1, team2, gamemode, tournamentid } = await roomModel
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
        if (gamemode === "1vs1") {
            //Here we need to calculate  1vs1 match winner
            calculateWinner1vs1(team1, team2, roomid, tournamentid);
        } else if (gamemode === "5vs5") {
            //Here we need to calculate  5vs5 match winner
        }
    } catch (error) {
        return error;
    }
};

/** These functions are for test the tournament  -------------- start */
export const setStatsData = async (roomid) => {
    try {
        const { team1, team2 } = await roomModel
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
        await roomModel.updateOne({ _id: roomid }, { running: false, mapvoting: "true" });
        let result1 = get1vs1ResultWin(team1[0]);
        console.log("result1", result1);
        await joinForPlayModel.updateOne(
            { _id: team1[0]._id },
            { result: result1, running: false }
        );
        let result2 = get1vs1ResultLoss(team2[0]);
        console.log("result2", result2);
        await joinForPlayModel.updateOne(
            { _id: team2[0]._id },
            { result: result2, running: false }
        );
    } catch (error) {
        return error;
    }
};

const get1vs1ResultWin = (team) => {
    const {
        userid: { _id, steamid },
    } = team;
    console.log(_id, steamid);
    return {
        kills: 16,
        rounds: 16,
        deaths: 3,
        headshots: 14,
        steamid,
        _id,
        result: "win",
        t_overall_score: 16,
        ct_overall_score: 3,
        points: 8,
    };
};
const get1vs1ResultLoss = (team) => {
    const {
        userid: { _id, steamid },
    } = team;
    console.log(_id, steamid);
    return {
        kills: 3,
        rounds: 3,
        deaths: 16,
        headshots: 2,
        steamid,
        _id,
        result: "loss",
        t_overall_score: 16,
        ct_overall_score: 3,
        points: -8,
    };
};
/** -------------------------test end------------------------------------ */

export const calculateDataForBrackets = (tournamnetData, tournamentStatus) => {
    if (!tournamentStatus) {
        let orgniseData = [];
        LevelsArray.forEach((el) => {
            let statsData = tournamnetData[el];
            if (statsData.length > 0) {
                statsData = statsData.map((element) => {
                    const { team1, team2, _id: roomid } = element;
                    return { team1: team1[0], team2: team2[0], roomid };
                });
                orgniseData.push({ [el]: statsData });
            } else {
                orgniseData.push({ [el]: [] });
            }
        });
        return orgniseData;
    } else {
        return [];
    }
};

export const OpenOrFinishedTournaments = async (status) => {
    try {
        const tournaments = await tournamentModel
            .find(
                { tournamentEnd: status },
                {
                    title: 1,
                    playerNumbers: 1,
                    gameType: 1,
                    tournamentType: 1,
                    tournamentStart: 1,
                    banner: 1,
                    tournamentPrize: 1,
                    createdBy: 1,
                }
            )
            .sort({ _id: -1 })
            .lean();
        return tournaments;
    } catch (error) {
        return error;
    }
};
