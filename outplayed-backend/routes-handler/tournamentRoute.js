import express from "express";
import { userAuthCheck, checkForLoggedIn } from "../middleware/checkAuth";
import userModel from "../models/user";
import tournamentModel from "../models/tournament";
import tournamentRulesModel from "../models/tournament-rules";
import roomModel from "../models/room";
import multiparty from "multiparty";
import fs from "fs";
import fileType from "file-type";
import crypto from "crypto";
import { checkIfEmpty, uploadFile } from "../functions";
import { JoinTournamentValidation, ValidateTournamentCheckIn } from "../functions/validations";
import teamModel from "../models/team";
import { FetchObject, LevelsArray } from "../config/config";
import {
    CheckInWhichTeamUserIs,
    CheckPlayerMapPick,
    PlayerMapPickTimer,
} from "../functions/matchmakingfunction";
import {
    InWhichRoomTeamUserIs,
    SendPlayerToNextRound,
    setStatsData,
    TournamentDataFetch,
    calculateDataForBrackets,
    OpenOrFinishedTournaments,
} from "../functions/tournament";

const router = new express.Router();
const TournamentRoute = (io) => {
    /**
     * This is the tournament route handler all the tournament specific
     * apis are performed from here
     */
    router.post("/createTournament", userAuthCheck, async (req, res) => {
        const form = new multiparty.Form();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                res.send({
                    code: 500,
                    msg: "Internal server error!!",
                });
            }
            try {
                const { isValid } = checkIfEmpty(req.query);
                if (isValid) {
                    const { path } = files.file ? files.file[0] : {};
                    const {
                        tokenData: { userid },
                    } = req.body;
                    if (path) {
                        const buffer = fs.readFileSync(path);
                        const type = await fileType.fromBuffer(buffer);
                        const timestamp = Date.now().toString();
                        const fileName = `bucketFolder/${timestamp}-lg`;
                        const hash = crypto.createHash("md5").update(fileName).digest("hex");
                        const data = await uploadFile(buffer, hash, type, "tournament");
                        req.query["createdBy"] = userid;
                        req.query["onModel"] = "users";
                        req.query["banner"] = data.Location;
                        const tournamentCreate = await tournamentModel.create(req.query);
                        await userModel.updateOne(
                            { _id: userid },
                            {
                                $push: {
                                    tournamentCreated: tournamentCreate._id,
                                },
                            }
                        );
                        io.emit("GetTournaments", tournamentCreate);
                        await res.send({
                            code: 200,
                            msg: "Tournament created successfully",
                        });
                    } else {
                        req.query["createdBy"] = userid;
                        req.query["onModel"] = "users";
                        const tournamentCreate = await tournamentModel.create(req.query);
                        await userModel.updateOne(
                            { _id: userid },
                            {
                                $push: {
                                    tournamentCreated: tournamentCreate._id,
                                },
                            }
                        );
                        io.emit("GetTournaments", tournamentCreate);
                        await res.send({
                            code: 200,
                            msg: "Tournament created successfully",
                        });
                    }
                } else {
                    res.send({
                        code: 500,
                        msg: "Invalid data",
                    });
                }
            } catch (e) {
                console.log(e);
                res.send({
                    code: 500,
                    msg: "Internal server error!!",
                });
            }
        });
    });

    router.get("/tournaments", checkForLoggedIn, async (req, res) => {
        try {
            const {
                body: { userid },
            } = req;
            const tournaments = await OpenOrFinishedTournaments(false);
            res.send({ code: 200, tournaments, userid });
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.get("/gettournaments/:tid", checkForLoggedIn, async (req, res) => {
        const {
            params: { tid },
        } = req;
        try {
            const { gameType, tournamentEnd } = await tournamentModel.findById(tid, {
                gameType: 1,
            });
            const tournamentData = await tournamentModel
                .findById(tid, {
                    title: 1,
                    playerNumbers: 1,
                    gameType: 1,
                    tournamentType: 1,
                    tournamentStart: 1,
                    banner: 1,
                    tournamentPrize: 1,
                    tournamentStarted: 1,
                    tournamentEnd: 1,
                    createdBy: 1,
                    playerJoined: 1,
                    checkedInPlayers: 1,
                })
                .populate(FetchObject(gameType))
                .lean();
            const tournamentRules = await tournamentRulesModel.find().lean();
            let TournamentDataForBrackets = await TournamentDataFetch(tid, false);
            TournamentDataForBrackets = calculateDataForBrackets(
                TournamentDataForBrackets,
                tournamentEnd
            );
            if (!tournamentData) {
                res.send({
                    code: 404,
                    msg: "Data Not found !!",
                });
            }
            res.send({ code: 200, tournamentData, tournamentRules, TournamentDataForBrackets });
        } catch (error) {
            console.log(error);
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.post("/joinTournament", userAuthCheck, async (req, res) => {
        try {
            const {
                body: {
                    tokenData: { userid },
                    tid,
                    teamid,
                },
            } = req;
            const teamidoruserid = teamid ? teamid : userid;
            const { isValid, errors, gameType } = await JoinTournamentValidation(
                userid,
                tid,
                teamidoruserid
            );
            if (!isValid) {
                res.send({ code: 201, errors });
                return;
            }
            const puhsObject =
                gameType === "5vs5"
                    ? { UserOrTeam: teamid, onModel: "team" }
                    : { UserOrTeam: userid, onModel: "users" };
            await tournamentModel.updateOne(
                { _id: tid },
                {
                    $push: {
                        playerJoined: puhsObject,
                    },
                }
            );
            if (gameType === "5vs5") {
                await teamModel.updateOne(
                    { _id: teamid },
                    {
                        $push: {
                            tournaments: tid,
                        },
                    }
                );
            }
            res.send({
                code: 200,
                msg: "Congratulations, you are registered for the tournament now!",
            });
            io.emit("TournamentEvents");
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.patch("/checkInTournament/:tid", userAuthCheck, async (req, res) => {
        try {
            const {
                params: { tid },
                body: {
                    tokenData: { userid },
                },
            } = req;
            const { isValid, errors } = await ValidateTournamentCheckIn(userid, tid);
            if (!isValid) {
                res.send({
                    code: 201,
                    errors,
                });
                return;
            }
            await tournamentModel.updateOne(
                { _id: tid },
                {
                    $push: {
                        checkedInPlayers: { _id: userid, checkedAt: new Date(), checked: true },
                    },
                }
            );
            res.send({
                code: 200,
                msg: "CHECK-IN process completed successfully !!",
            });
            io.emit("TournamentEvents");
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.get("/tournamentRoomData/:id", userAuthCheck, async (req, res) => {
        try {
            const {
                params: { id },
                body: {
                    tokenData: { userid },
                },
            } = req;
            const { isValid, team } = await CheckInWhichTeamUserIs(id, userid);
            //  console.log(isValid, team);
            if (!isValid) {
                res.send({ code: 201, msg: "Unexpected" });
                return;
            }
            console.log(typeof id);
            const tournamentRoomData = await roomModel
                .findById(id, {
                    name: 1,
                    team1: 1,
                    team2: 1,
                    running: 1,
                    cancelled: 1,
                    [team]: 1,
                    mapvoting: 1,
                    maps: 1,
                    joinip: 1,
                    gamemode: 1,
                    istournament: 1,
                    tournamentid: 1,
                })
                .populate({
                    path: team,
                    populate: {
                        path: "sendby",
                        select: {
                            username: 1,
                            prestige: 1,
                        },
                    },
                })
                .populate({
                    path: "team1",
                    select: {
                        userid: 1,
                        iscaptain: 1,
                        result: 1,
                    },
                    populate: {
                        path: "userid",
                        select: {
                            username: 1,
                            useravatar: 1,
                            prestige: 1,
                        },
                    },
                })
                .populate({
                    path: "team2",
                    select: {
                        userid: 1,
                        iscaptain: 1,
                        result: 1,
                    },
                    populate: {
                        path: "userid",
                        select: {
                            username: 1,
                            useravatar: 1,
                            prestige: 1,
                        },
                    },
                })
                .populate({
                    path: "comments",
                    options: {
                        sort: {
                            _id: -1,
                        },
                    },
                    populate: {
                        path: "commentby",
                        select: {
                            username: 1,
                            useravatar: 1,
                        },
                    },
                })
                .lean();
            res.send({
                code: 200,
                tournamentRoomData,
                userid,
            });
        } catch (e) {
            console.log(e);
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.put("/tournamentMapVote", userAuthCheck, async (req, res) => {
        try {
            const {
                body: {
                    tokenData: { userid },
                    roomid,
                    mapname,
                },
            } = req;
            const RoomsData = await roomModel
                .findById(roomid)
                .populate({ path: "team1" })
                .populate({ path: "team2" })
                .lean();
            let isCaptain = false;
            if (RoomsData) {
                let { team1, team2, gamemode } = RoomsData;
                const concatedArray = [...team1, ...team2];
                concatedArray.forEach((el) => {
                    if (el.userid.toString() === userid.toString() && el.iscaptain) {
                        isCaptain = true;
                    }
                });
                const anotherchance = concatedArray.filter(
                    (element) => element.userid.toString() !== userid && element.iscaptain
                );
                if (isCaptain) {
                    await roomModel.updateOne(
                        {
                            _id: roomid,
                            "maps.title": mapname,
                        },
                        {
                            $set: {
                                "maps.$.open": false,
                            },
                        }
                    );
                    io.in(roomid).emit("PickMapEvent", mapname);
                    CheckPlayerMapPick(roomid, anotherchance[0].userid, io, gamemode);
                    // checkMapVote(roomid, ids, io);
                    res.end();
                } else {
                    res.send({
                        code: 201,
                        msg: "",
                    });
                }
            } else {
                res.send({
                    code: 404,
                    msg: "Room not found !!!",
                });
            }
        } catch (e) {
            console.log(e);
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.post("/goToTheRoom/:tournamentid", userAuthCheck, async (req, res) => {
        try {
            const {
                params: { tournamentid },
                body: {
                    tokenData: { userid },
                },
            } = req;
            const { roomLevel, roomidData } = await InWhichRoomTeamUserIs(
                tournamentid,
                userid,
                true
            );
            if (roomLevel && roomidData) {
                res.send({ code: 200, roomid: roomidData });
            } else {
                res.send({
                    code: 404,
                    msg: "Room not found !!!",
                });
            }
        } catch (e) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.post("/setRaedy/:roomid/:tournamentid", userAuthCheck, async (req, res) => {
        try {
            const {
                params: { roomid, tournamentid },
                body: {
                    tokenData: { userid },
                },
            } = req;
            const { roomidData, captainCheck } = await InWhichRoomTeamUserIs(
                tournamentid,
                userid,
                true
            );
            if (roomid.toString() !== roomidData.toString() && !captainCheck) {
                res.send({
                    msg:
                        "You are not able to start the match (only captains can start the match )!!",
                    code: 201,
                });
                return;
            }
            const { gamemode, mapvoting } = await roomModel.findById(roomid, {
                gamemode: 1,
                mapvoting: 1,
            });
            if (mapvoting === "true") {
                res.end();
                return;
            }
            await roomModel.updateOne({ _id: roomid }, { mapvoting: "true" });
            io.in(roomid.toString()).emit("GetMapVotingStart");
            PlayerMapPickTimer(roomid, userid, io, 60, gamemode);
            console.log("yes i am captain !!!", gamemode, mapvoting);
            res.end();
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    /** This api routes are used for testing the tournaments the data */
    router.post("/promotePlayerToNextRounds", async (req, res) => {
        try {
            const {
                body: { roomid },
            } = req;
            await SendPlayerToNextRound(roomid);
            res.end();
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.post("/setStats", async (req, res) => {
        try {
            const {
                body: { roomid },
            } = req;
            await setStatsData(roomid);
            res.end();
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });
    /** --------------------- END ------------------------------------- */
    router.get("/finished-tournaments", checkForLoggedIn, async (req, res) => {
        try {
            const {
                body: { userid },
            } = req;
            const tournaments = await OpenOrFinishedTournaments(true);
            res.send({ code: 200, tournaments, userid });
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    return router;
};
export default TournamentRoute;
