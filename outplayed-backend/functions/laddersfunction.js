import teamModel from "../models/team";
import userModel from "../models/user";
import ladderChallengeModel from "../models/ladderchallenge";
import roomModel from "../models/room";
import { AllMaps } from ".";
import joinForPlayModel from "../models/joinforplay";
import laddersModel from "../models/ladders";

const LadderRoomCaptain = (players, roomid, type) => {
    let userArray = players.map((el, i) => {
        let obj = {
            userid: el._id,
            jointype: type,
            roomid,
            iscaptain: i === 0 ? true : false,
        };
        return obj;
    });
    return userArray;
};
export const CreateAcceptRoomLadder = async (challengeId, io) => {
    //This function is used to create room when any user or team captain accept the opponent challnege
    // Then we try to find both users and teams and create a seperate room for both of them
    try {
        const {
            teamIds,
            gameType,
            ladderid,
            challengeBy,
            challengeTo,
            dateTime,
        } = await ladderChallengeModel.findById(challengeId);
        if (gameType === "5vs5") {
            const { joinedmembers: team1Members } = await teamModel.findById(teamIds[0]).populate({
                path: "joinedmembers",
                select: {
                    _id: 1,
                },
            });
            const { joinedmembers: team2Members } = await teamModel.findById(teamIds[1]).populate({
                path: "joinedmembers",
                select: {
                    _id: 1,
                },
            });
            let maps = await AllMaps("5vs5");
            let gametype = "ladder5vs5";
            let gamemode = "5vs5";
            const createRoom = await roomModel.create({
                gametype,
                maps,
                gamemode,
                ladderChallengeAt: dateTime,
            });

            let team1 = LadderRoomCaptain(team1Members, createRoom._id, gametype);
            let team2 = LadderRoomCaptain(team2Members, createRoom._id, gametype);

            console.log("team1, team2 =>>>", team1, team2);

            team1 = await joinForPlayModel.create(team1);
            team2 = await joinForPlayModel.create(team2);

            team1 = team1.map((el) => el._id);
            team2 = team2.map((el) => el._id);

            await roomModel.updateOne(
                { _id: createRoom._id },
                {
                    team1,
                    team2,
                }
            );
            await laddersModel.updateOne(
                { _id: ladderid },
                {
                    $push: {
                        rooms: createRoom._id,
                    },
                }
            );
            await ladderChallengeModel.updateOne({ _id: challengeId }, { roomid: createRoom._id });
            console.log("all done in the accept room ladder 5vs5");
        } else if (gameType === "1vs1") {
            let maps = await AllMaps("1vs1");
            let gametype = "ladder1vs1";
            let gamemode = "1vs1";
            const createRoom = await roomModel.create({
                gametype,
                maps,
                gamemode,
                ladderChallengeAt: dateTime,
            });

            let team1 = LadderRoomCaptain([{ _id: challengeBy }], createRoom._id, gametype);
            let team2 = LadderRoomCaptain([{ _id: challengeTo }], createRoom._id, gametype);

            console.log("team1, team2 =>>>", team1, team2);

            team1 = await joinForPlayModel.create(team1);
            team2 = await joinForPlayModel.create(team2);

            team1 = team1.map((el) => el._id);
            team2 = team2.map((el) => el._id);

            await roomModel.updateOne(
                { _id: createRoom._id },
                {
                    team1,
                    team2,
                }
            );

            await laddersModel.updateOne(
                { _id: ladderid },
                {
                    $push: {
                        rooms: createRoom._id,
                    },
                }
            );
            await ladderChallengeModel.updateOne({ _id: challengeId }, { roomid: createRoom._id });
            console.log("all done in the accept room ladder 1vs1.");
        }
    } catch (error) {
        return error;
    }
};
