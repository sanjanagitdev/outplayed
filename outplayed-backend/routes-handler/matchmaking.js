import express from "express";
import { userAuthCheck, checkForLoggedIn } from "../middleware/checkAuth";
import queueModel from "../models/queue";
import userModel from "../models/user";
import {
    checkValidation5v5,
    sendResponse,
    CheckInWhichTeamUserIs,
    CheckPlayerMapPick,
    checkValidation1vs1,
    QueueFilter1vs1,
    PreMatchStatsByRankme,
    PostMatchStatsByRankme,
} from "../functions/matchmakingfunction";
import { objectId } from "../functions/validations";
import roomModel from "../models/room";
import joinForPlayModel from "../models/joinforplay";
import commentModel from "../models/comment";
import { checkIfEmpty, QueueLength, SetAsNormal } from "../functions";

const router = new express.Router();
const MatchMakingRoute = (io) => {
    router.post("/queuefilter5v5", userAuthCheck, async (req, res) => {
        try {
            const { body } = req;
            console.log(body);
            const {
                type: gamemode,
                id,
                tokenData: { userid },
            } = body;
            let object;
            console.log(body);
            let { isValid, errors, groupmembers, teammembers } = await checkValidation5v5(body);
            if (!isValid) {
                res.send({ code: 201, errors });
                return;
            }
            if (gamemode === "solo") {
                const singleQueue = await queueModel
                    .find({ $where: "this.player.length < 2" })
                    .lean();
                if (singleQueue.length > 0) {
                    const { _id } = singleQueue[0];
                    await queueModel.updateOne(
                        { _id },
                        {
                            $push: {
                                player: userid,
                            },
                        }
                    );
                    sendResponse(io, res, _id);
                } else {
                    object = { gamemode, queuetype: "5vs5", player: [userid] };
                    const queue = await queueModel.create(object);
                    sendResponse(io, res, queue._id);
                }
            } else if (gamemode === "team") {
                teammembers = teammembers.map((el) => el._id);
                object = { gamemode, team: id, queuetype: "5vs5", player: teammembers };
                const queue = await queueModel.create(object);
                sendResponse(io, res, queue._id);
            } else if (gamemode === "group") {
                groupmembers = groupmembers.map((el) => el._id);
                object = {
                    gamemode,
                    group: id,
                    queuetype: "5vs5",
                    player: groupmembers,
                };
                const queue = await queueModel.create(object);
                sendResponse(io, res, queue._id);
            }
        } catch (error) {
            console.log("error in matchmaking 5v5", error);
            res.send({
                code: 500,
                msg: "Internal server error !!",
            });
        }
    });
    router.get("/checkvalidqueue/:queueid", async (req, res) => {
        try {
            const {
                params: { queueid },
            } = req;
            const IsvalidQueue = await queueModel.find({
                $and: [{ _id: queueid }, { valid: true }],
            });
            if (IsvalidQueue.length > 0) {
                res.send({ code: 200, msg: "Valid" });
            } else {
                res.send({ code: 201, msg: "Invalid" });
            }
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error !!",
            });
        }
    });

    router.delete("/removequeue/:queueid/:type", userAuthCheck, async (req, res) => {
        try {
            const {
                params: { queueid, type },
                body: {
                    tokenData: { userid },
                },
            } = req;
            if (type === "solo") {
                await queueModel.updateOne(
                    { _id: queueid },
                    {
                        $pull: {
                            player: objectId(userid),
                        },
                    }
                );
                res.send({ code: 200, msg: "Cancelled successfully" });
            } else {
                await queueModel.deleteOne({ _id: queueid });
                res.send({ code: 200, msg: "Cancelled successfully" });
            }
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error !!",
            });
        }
    });

    router.get("/playersinqueue/:type/:id", userAuthCheck, async (req, res) => {
        try {
            const {
                params: { type, id },
                body: {
                    tokenData: { userid },
                },
            } = req;
            const { group, teams } = await userModel
                .findById(userid, { group: 1, teams: 1 })
                .populate({
                    path: "group",
                    populate: {
                        path: "joinedmembers",
                        select: {
                            username: 1,
                            useravatar: 1,
                        },
                    },
                    populate: {
                        path: "joinedmembers",
                        select: {
                            username: 1,
                            useravatar: 1,
                        },
                    },
                })
                .populate({
                    path: "teams",
                    populate: {
                        path: "joinedmembers",
                        select: {
                            username: 1,
                            useravatar: 1,
                        },
                    },
                })
                .lean();
            //User Data
            if (type === "group") {
                const { joinedmembers, invitedmembers } = group;
                res.send({ code: 200, joinedmembers, invitedmembers });
            } else if (type === "team") {
                const filterteam = teams.filter((el) => el._id.toString() === id.toString());
                if (filterteam.length > 0) {
                    const { joinedmembers } = filterteam[0];
                    res.send({ code: 200, joinedmembers });
                } else {
                    res.send({ code: 201, msg: "unexpected" });
                }
            } else {
                res.send({ code: 201, msg: "unexpected" });
            }
        } catch (e) {
            res.send({
                code: 500,
                msg: "Internal server error !!",
            });
        }
    });

    router.patch("/setready/:roomid", userAuthCheck, async (req, res) => {
        try {
            const {
                params: { roomid },
                body: {
                    tokenData: { userid },
                },
            } = req;
            const { team1, team2 } = await roomModel
                .findById(roomid, { team1: 1, team2: 1 })
                .populate({ path: "team1" })
                .populate({ path: "team2" });
            const concatedArray = [...team1, ...team2];
            const isFind = concatedArray.filter((el) => el.userid.toString() === userid.toString());
            if (isFind.length > 0) {
                const { _id } = isFind[0];
                await joinForPlayModel.updateOne({ _id }, { ready: true });
                res.send({ code: 200 });
            } else {
                res.send({ code: 201, msg: "Unexpected" });
            }
        } catch (e) {
            res.send({
                code: 200,
                msg: "Internal server error !!",
            });
        }
    });

    router.get("/matchmakingroomdata/:id", userAuthCheck, async (req, res) => {
        try {
            const {
                params: { id },
                body: {
                    tokenData: { userid },
                },
            } = req;
            const { isValid, team } = await CheckInWhichTeamUserIs(id, userid);
            if (!isValid) {
                res.send({ code: 201, msg: "Unexpected" });
                return;
            }
            const matchmakingRoomData = await roomModel
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
                matchmakingRoomData,
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

    router.put("/mapvote", userAuthCheck, async (req, res) => {
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

    router.post("/postComment", userAuthCheck, async (req, res) => {
        try {
            /**
             * This api route is used to post the comments on the completed matchamking room
             * We returned posted comment in the response
             */
            const { comment, roomid } = req.body;
            const { tokenData } = req.body;
            const { isValid } = checkIfEmpty({ comment, roomid });
            if (isValid) {
                let { useravatar, username, steamavatar } = await userModel.findById(
                    tokenData.userid
                );
                const saveComment = await commentModel.create({
                    commentby: tokenData.userid,
                    comment,
                    date: Date.now(),
                });
                await roomModel.updateOne(
                    {
                        _id: roomid,
                    },
                    {
                        $push: {
                            comments: saveComment._id,
                        },
                    }
                );
                let commentone = {
                    _id: saveComment._id,
                    commentby: {
                        useravatar,
                        username,
                        steamavatar,
                    },
                    comment: saveComment.comment,
                    date: saveComment.date,
                };
                res.send({
                    code: 200,
                    saveComment: commentone,
                    msg: "commented successfully",
                });
            } else {
                res.send({
                    code: 201,
                    msg: "Invalid request",
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

    router.get("/rankandlength", async (req, res) => {
        try {
            const queuelength = await QueueLength();
            const MonthlyRank = await SetAsNormal("matchmaking");
            res.send({
                code: 200,
                queuelength,
                MonthlyRank,
            });
        } catch (e) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    /** --- Here we started 1vs1 matchmaking functionality --- */
    router.post("/queuefilter1v1", userAuthCheck, async (req, res) => {
        try {
            let {
                body: {
                    tokenData: { userid },
                    premium,
                    advanced,
                },
            } = req;
            const { isValid, errors } = await checkValidation1vs1({ userid, premium, advanced });
            if (!isValid) {
                res.send({ code: 201, errors });
                return;
            }
            const object = { gamemode: "solo", queuetype: "1vs1", player: [userid] };
            const queue = await queueModel.create(object);
            QueueFilter1vs1(io);
            res.send({
                code: 200,
                msg: "You are successfully pushed in the queue",
                queueid: queue._id,
            });
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error !!",
            });
        }
    });

    router.delete("/removequeue1vs1/:queueid", userAuthCheck, async (req, res) => {
        try {
            const {
                params: { queueid },
            } = req;
            await queueModel.deleteOne({ _id: queueid });
            res.send({ code: 200, msg: "Cancelled successfully" });
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error !!",
            });
        }
    });

    // router.get("/rankmeStats", async (req, res) => {
    //     try {
    //         const mysqlStats = await PreMatchStatsByRankme(
    //             "76561198837905868",
    //             "76561198813289464"
    //         );
    //         console.log("mysqlStats", mysqlStats);
    //         res.send({ code: 200, mysqlStats });
    //     } catch (error) {
    //         res.send({
    //             code: 500,
    //             msg: "Internal server error !!",
    //             error,
    //         });
    //     }
    // });
    // router.get("/postMatchStats", async (req, res) => {
    //     try {
    //         let { team1, team2 } = await roomModel
    //             .findById("5fe08cb8559e4b161c0469b4", {
    //                 userid: 1,
    //             })
    //             .populate({
    //                 path: "team1",
    //                 populate: {
    //                     path: "userid",
    //                     select: {
    //                         steamid: 1,
    //                         old1vs1stats: 1,
    //                     },
    //                 },
    //             })
    //             .populate({
    //                 path: "team2",
    //                 populate: {
    //                     path: "userid",
    //                     select: {
    //                         steamid: 1,
    //                         old1vs1stats: 1,
    //                     },
    //                 },
    //             })
    //             .lean();
    //         PostMatchStatsByRankme(team1, team2);
    //         res.send({ code: 200, msg: "Success", data: { team1, team2 } });
    //     } catch (error) {
    //         res.send({
    //             code: 500,
    //             msg: "Internal server error !!",
    //             error,
    //         });
    //     }
    // });
    return router;
};
export default MatchMakingRoute;
