import express from "express";
import { userAuthCheck, checkForLoggedIn, userAuthCheckFirst } from "../middleware/checkAuth";
import userModel from "../models/user";
import laddersModel from "../models/ladders";
import roomModel from "../models/room";
import multiparty from "multiparty";
import fs from "fs";
import fileType from "file-type";
import crypto from "crypto";
import { checkIfEmpty, uploadFile, CreateNotification, InformToTeamMembers } from "../functions";
import teamModel from "../models/team";
import { FetchObject } from "../config/config";
import {
    CheckInWhichTeamUserIs,
    CheckPlayerMapPick,
    PlayerMapPickTimer,
} from "../functions/matchmakingfunction";
import { JoinLadderValidation, ChallengeInLadderValidation } from "../functions/validations";
import ladderChallengeModel from "../models/ladderchallenge";
import { CreateAcceptRoomLadder } from "../functions/laddersfunction";

const router = new express.Router();
const LadderRoute = (io) => {
    /**
     * This is the ladders route handler all the ladders specific
     * apis are performed from here
     */
    router.post("/createLadder", userAuthCheck, async (req, res) => {
        const form = new multiparty.Form();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                res.send({
                    code: 500,
                    msg: "Internal server error!!",
                });
                return;
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
                        const laddersCreate = await laddersModel.create(req.query);
                        await userModel.updateOne(
                            { _id: userid },
                            {
                                $push: {
                                    laddersCreated: laddersCreate._id,
                                },
                            }
                        );
                        io.emit("GetLadders", laddersCreate);
                        await res.send({
                            code: 200,
                            msg: "Ladder created successfully",
                        });
                    } else {
                        req.query["createdBy"] = userid;
                        req.query["onModel"] = "users";
                        const laddersCreate = await laddersModel.create(req.query);
                        await userModel.updateOne(
                            { _id: userid },
                            {
                                $push: {
                                    laddersCreated: laddersCreate._id,
                                },
                            }
                        );
                        io.emit("GetLadders", laddersCreate);
                        await res.send({
                            code: 200,
                            msg: "Ladder created successfully",
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

    //This api is used to get all running/finished ladders
    router.get("/ladders/:type", checkForLoggedIn, async (req, res) => {
        try {
            const {
                body: { userid },
                params: { type },
            } = req;
            const status = type === "running" ? false : true;
            const ladders = await laddersModel
                .find(
                    { ladderEnd: status },
                    {
                        title: 1,
                        playerNumbers: 1,
                        gameType: 1,
                        ladderType: 1,
                        ladderStart: 1,
                        ladderEndDate: 1,
                        banner: 1,
                        ladderPrize: 1,
                        createdBy: 1,
                    }
                )
                .sort({ _id: -1 })
                .lean();
            res.send({ code: 200, ladders, userid });
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.get("/getladders/:lid", checkForLoggedIn, async (req, res) => {
        const {
            params: { lid },
        } = req;
        try {
            const { gameType } = await laddersModel.findById(lid, {
                gameType: 1,
            });
            const ladderData = await laddersModel
                .findById(lid, {
                    title: 1,
                    playerNumbers: 1,
                    gameType: 1,
                    ladderType: 1,
                    ladderStart: 1,
                    ladderEndDate: 1,
                    banner: 1,
                    ladderPrize: 1,
                    ladderStarted: 1,
                    ladderEnd: 1,
                    createdBy: 1,
                    playerJoined: 1,
                })
                .populate(FetchObject(gameType))
                .lean();
            if (!ladderData) {
                res.send({
                    code: 404,
                    msg: "Data Not found !!",
                });
            }
            res.send({ code: 200, ladderData });
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.post("/joinLadder", userAuthCheck, async (req, res) => {
        try {
            const {
                body: {
                    tokenData: { userid },
                    lid,
                    teamid,
                },
            } = req;
            const teamidoruserid = teamid ? teamid : userid;
            const { isValid, errors, gameType } = await JoinLadderValidation(
                userid,
                lid,
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
            await laddersModel.updateOne(
                { _id: lid },
                {
                    $push: {
                        playerJoined: puhsObject,
                    },
                }
            );
            res.send({
                code: 200,
                msg: "Congratulations, you are registered for the ladder now!",
            });
            io.emit("LadderEvents");
        } catch (error) {
            console.log(error);
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    //This api route is used for challange player

    router.post("/challengePlayer", userAuthCheck, async (req, res) => {
        try {
            const {
                body: {
                    fromId,
                    toId,
                    lid,
                    creatorTo: challengeTo,
                    creatorFrom: challengeBy,
                    dateTime,
                },
            } = req;
            const { isValid, errors, gameType, title } = await ChallengeInLadderValidation(
                lid,
                fromId,
                toId
            );
            if (!isValid) {
                res.send({
                    code: 201,
                    errors,
                });
                return;
            }
            const createChallenge = await ladderChallengeModel.create({
                challengeTo,
                challengeBy,
                dateTime,
                ladderid: lid,
                teamIds: [fromId, toId],
                gameType,
            });
            await userModel.updateMany(
                { _id: { $in: [challengeTo, challengeBy] } },
                {
                    $push: {
                        laddersChallenges: createChallenge._id,
                    },
                }
            );
            await laddersModel.updateOne(
                { _id: lid },
                {
                    $push: {
                        challenges: createChallenge._id,
                    },
                }
            );
            if (gameType === "5vs5") {
                const fromData = await teamModel.findById(fromId);
                const toData = await teamModel.findById(toId);
                if (fromData && toData) {
                    const { joinedmembers: from, name: fromname } = fromData;
                    const { joinedmembers: to, name: toname } = toData;
                    await InformToTeamMembers(
                        from,
                        to,
                        title,
                        fromname,
                        toname,
                        challengeBy,
                        challengeTo,
                        io
                    );
                    //Here we send not
                }
            } else if (gameType === "1vs1") {
                const { username } = await userModel.findById(challengeBy);
                let topic = `${username} Challenges you in the ${title} ladder`;
                let type = "laddercap";
                await CreateNotification(challengeBy, challengeTo, topic, type, io);
            }
            res.send({ code: 200, msg: "Successfully challenges" });
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.patch("/editRejectAccepetChallenge/:challengeId", userAuthCheck, async (req, res) => {
        try {
            const {
                params: { challengeId },
                body: { dateTime, type },
            } = req;
            let object = {};
            if (type === "edit") {
                object = { dateTime };
            } else if (type === "reject") {
                object = { state: "rejected" };
            } else if (type === "accept") {
                object = { state: "accepted" };
            }
            await ladderChallengeModel.updateOne({ _id: challengeId }, object);

            if (type === "accept") {
                await CreateAcceptRoomLadder(challengeId, io);
            }
            res.send({ code: 200, msg: "Success" });
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.get("/ladderRoomData/:id", userAuthCheck, async (req, res) => {
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
            const ladderRoomData = await roomModel
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
                    ladderChallengeAt: 1,
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
                ladderRoomData,
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

    router.put("/ladderMapVote", userAuthCheck, async (req, res) => {
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
    router.post("/startGame/:roomid", userAuthCheck, async (req, res) => {
        try {
            const {
                params: { roomid },
                body: {
                    tokenData: { userid },
                },
            } = req;
            const { captainCheck } = await CheckInWhichTeamUserIs(roomid, userid);
            if (!captainCheck) {
                res.send({
                    msg:
                        "You are not able to start the match (only captains can start the match )!!",
                    code: 201,
                });
                return;
            }
            const { gamemode, mapvoting, ladderChallengeAt } = await roomModel.findById(roomid, {
                gamemode: 1,
                mapvoting: 1,
                ladderChallengeAt: 1,
            });
            if (new Date(ladderChallengeAt).getTime() > new Date().getTime()) {
                res.send({ code: 201, msg: "You cant able to start match now !!" });
                return;
            }
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

    return router;
};
export default LadderRoute;
