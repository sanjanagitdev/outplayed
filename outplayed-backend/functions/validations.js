import userModel from "../models/user";
import joinForPlayModel from "../models/joinforplay";
import hubsModel from "../models/hubs";
import mongoose from "mongoose";
import { GetPrestigeAccPoint, IsMemberShip, GetDiffrenceInMinutes } from "./";
import tournamentModel from "../models/tournament";
import laddersModel from "../models/ladders";
import { FetchObject } from "../config/config";
import scoutingAreaModel from "../models/scoutingarea";
import roomModel from "../models/room";
import gameReportModel from "../models/gamereports";

export const CheckValidateHubCreate = async (req) => {
    let {
        tokenData: { userid: createdby },
        premium,
        premiumadvanced,
        prestige,
    } = req.body;
    let errors = {};
    let isVlaid = true;
    createdby = objectId(createdby);
    let { ispremium, ispremiumadvnaced, username: name } = await userModel
        .findById(createdby)
        .lean();
    let payload = {
        name,
        premium,
        premiumadvanced,
        prestige,
        createdby,
    };
    const checkAlreadyExist = await CheckUserExistHub(createdby);
    if (checkAlreadyExist) {
        isVlaid = false;
        errors.exist =
            "You are already in the running hub,please complete that hub and then try to join or create a hub";
    }
    if (ispremium || ispremiumadvnaced) {
    } else {
        isVlaid = false;
        errors.ispremium = "Only premium players can create hubs";
    }
    return { isVlaid, errors, payload };
};

export const CheckUserExistHub = async (createdby) => {
    const checkAlreadyExist = await joinForPlayModel
        .findOne({
            $and: [{ running: true }, { userid: createdby }, { jointype: "hub" }],
        })
        .lean();
    return checkAlreadyExist;
};
export const CheckUserExistIn = async (userid, hubid) => {
    const checkAlreadyExist = await joinForPlayModel
        .findOne({
            $and: [
                {
                    $and: [{ running: true }, { userid: objectId(userid) }, { jointype: "hub" }],
                },
                { $and: [{ hubid: objectId(hubid) }, { running: true }] },
            ],
        })
        .lean();
    return checkAlreadyExist;
};

export const objectId = (id) => {
    return mongoose.Types.ObjectId(id);
};

export const validateHubJoin = async (userid, hubid) => {
    let errors = {};
    let isVlaid = true;
    const {
        username,
        ispremium,
        ispremiumadvnaced,
        prestige: elo,
        penalty,
    } = await userModel.findById(userid);
    let GetPrestigePoint = GetPrestigeAccPoint(elo);
    let Until = penalty
        ? new Date(penalty).getTime() > new Date().getTime()
            ? true
            : false
        : false;
    let { premium, premiumadvanced, prestige, joinedplayers } = await hubsModel.findById(hubid);
    const joinedData = { userid: { prestige: elo, username } };
    const checkInOtherHub = await CheckUserExistHub(objectId(userid));
    if (checkInOtherHub) {
        isVlaid = false;
        errors.exist =
            "You are already in the running hub,please complete that hub and then try to join another hub";
    } else if (premium || premiumadvanced) {
        if (!(ispremium || ispremiumadvnaced)) {
            isVlaid = false;
            errors.exist =
                "Please try to join a normal hub because you are not a premium or advance member";
        }
    }
    if (joinedplayers.length >= 10) {
        isVlaid = false;
        errors.full = "All slots are full please try to join another hub";
    }
    if (parseInt(GetPrestigePoint.split(" ")[1]) < parseInt(prestige.split(" ")[1])) {
        isVlaid = false;
        errors.notable =
            "You are not able to join this hub, please try to play more matches and increase your prestige";
    }
    if (Until) {
        isVlaid = false;
        errors.until = "You got a penalty of 15 minutes ,try to join after 15 minutes !!";
    }
    return { isVlaid, errors, joinedData };
};

export const RemoveFromOrGroupValidate = async (req) => {
    try {
        let isValid = true;
        let errors = {};
        const {
            body: {
                tokenData: { userid },
            },
            params: { id, type, teamid },
        } = req;
        const FindObject =
            type === "teams"
                ? {
                      path: type,
                      match: { _id: objectId(teamid) },
                      select: { joinedmembers: 1, creator: 1 },
                  }
                : { path: type, select: { joinedmembers: 1, creator: 1 } };
        const findData = await userModel
            .findById(userid, { [type]: 1 })
            .populate(FindObject)
            .lean();
        const { joinedmembers, _id, creator } =
            type === "teams" ? findData[type][0] : findData[type];
        console.log(joinedmembers);
        const checkExist = joinedmembers.filter((el) => el.toString() === id.toString());
        if (checkExist.length <= 0) {
            isValid = false;
            errors.msg1 = `This player does'nt exist in your ${type}`;
        }
        if (userid.toString() !== creator.toString()) {
            isValid = false;
            errors.msg2 = `You are not able to remove members from this ${type}`;
        }
        return { isValid, errors, type, _id, id, userid };
    } catch (e) {
        return e;
    }
};
export const RemoveTeam = async (teamid, userid) => {
    try {
        await userModel.updateOne(
            { _id: userid },
            {
                $pull: {
                    teams: objectId(teamid),
                },
            }
        );
        return true;
    } catch (e) {
        return e;
    }
};

const SomeMembersExistInTournaMent = (MyMembers, tournamentJoindTeams) => {
    /** In this function we are checking some of the team members are already exist or not in the
     *  tournament with another team -
     */
    let isValidMember = true;
    let alredayExist = [];
    let existNames = [];
    MyMembers = MyMembers[0] ? MyMembers[0].joinedmembers : [];
    tournamentJoindTeams.forEach((el) => {
        if (el.UserOrTeam && el.UserOrTeam.joinedmembers) {
            alredayExist = [...alredayExist, ...el.UserOrTeam.joinedmembers];
        }
    });

    MyMembers.forEach((el) => {
        let findExist = alredayExist.filter(
            (Element) => Element._id.toString() === el._id.toString()
        );
        if (findExist.length > 0) {
            existNames.push(el.username);
            isValidMember = false;
        }
    });

    return { isValidMember, existNames };
};

export const JoinTournamentValidation = async (userid, tourna_id, teamidoruserid) => {
    try {
        let isValid = true;
        let errors = {};

        const { teams, ispremium, ispremiumadvnaced } = await userModel
            .findById(userid, { teams: 1, ispremium: 1, ispremiumadvnaced: 1 })
            .populate({
                path: "teams",
                match: { _id: objectId(teamidoruserid) },
                select: { joinedmembers: 1 },
                populate: {
                    path: "joinedmembers",
                    select: { username: 1 },
                },
            })
            .lean();
        const { tournamentType, tournamentStart, playerJoined, gameType } = await tournamentModel
            .findById(tourna_id, {
                tournamentType: 1,
                tournamentStarted: 1,
                tournamentType: 1,
                gameType: 1,
                playerJoined: 1,
                tournamentStart: 1,
            })
            .populate({ path: "playerJoined.UserOrTeam" })
            .lean();
        const checkAlreadyExist = await tournamentModel.find({
            $and: [{ "playerJoined.UserOrTeam": objectId(teamidoruserid) }, { _id: tourna_id }],
        });
        if (checkAlreadyExist.length > 0) {
            isValid = false;
            errors.already = "You are already exist in this tournament !!";
        } else if (gameType === "5vs5") {
            // If the game type is 5vs5 then check , some members are exist or not in another team !!
            const { isValidMember, existNames } = SomeMembersExistInTournaMent(teams, playerJoined);
            if (!isValidMember) {
                isValid = false;
                errors.already = ` Your team members ${existNames.join()} are already exist in this tournament with another team`;
            }
        }
        //Cheking the membership type
        if (IsMemberShip(ispremium, ispremiumadvnaced) !== tournamentType) {
            isValid = false;
            errors.invalid_membership = `Please upgrade your membership and then try to participate in this tournament !!`;
        }
        // Get diffrence between current time and start time
        if (GetDiffrenceInMinutes(tournamentStart) <= 5) {
            isValid = false;
            errors.timeleft = `You are not able to join this tournament because the check-in time was elapsed !!`;
        }
        return { isValid, errors, gameType };
    } catch (error) {
        return { isValid: false, errors: { unexpected: "Unexpected error !!" } };
    }
};

export const GetEasyArray = (playerJoined) => {
    let Players = [];
    playerJoined.forEach((element) => {
        if (element.UserOrTeam && element.onModel === "users") {
            Players.push(element.UserOrTeam);
        } else if (element.UserOrTeam && element.onModel === "team") {
            Players = [...Players, ...element.UserOrTeam.joinedmembers];
        }
    });
    return Players;
};
export const ValidateTournamentCheckIn = async (userid, tid) => {
    try {
        let isValid = true;
        let errors = {};
        const { gameType } = await tournamentModel.findById(tid, { gameType: 1 });
        const { playerJoined, checkedInPlayers } = await tournamentModel
            .findById(tid, {
                playerJoined: 1,
                checkedInPlayers: 1,
            })
            .populate(FetchObject(gameType))
            .lean();
        const PlayerArray = GetEasyArray(playerJoined);
        const isExist = PlayerArray.filter((el) => el._id.toString() === userid.toString());
        const isVlidateCheckIn = checkedInPlayers.filter(
            (el) => el._id.toString() === userid.toString()
        );
        if (isExist.length <= 0) {
            isValid = false;
            errors.notexist = "You not exist in this tournament so you cant able to CHECK-IN !!";
        }
        if (isVlidateCheckIn.length > 0) {
            isValid = false;
            errors.alreadycheckin = "You already completed CHECK-IN process !!";
        }
        return { isValid, errors };
    } catch (error) {
        return { isValid: false, errors: { unexpected: "Unexpected error !!" } };
    }
};

export const JoinLadderValidation = async (userid, ladder_id, teamidoruserid) => {
    try {
        let isValid = true;
        let errors = {};
        const { teams, ispremium, ispremiumadvnaced } = await userModel
            .findById(userid, { teams: 1, ispremium: 1, ispremiumadvnaced: 1 })
            .populate({
                path: "teams",
                match: { _id: objectId(teamidoruserid) },
                select: { joinedmembers: 1 },
                populate: {
                    path: "joinedmembers",
                    select: { username: 1 },
                },
            })
            .lean();
        const { ladderType, gameType, playerJoined } = await laddersModel
            .findById(ladder_id, {
                ladderStarted: 1,
                ladderType: 1,
                gameType: 1,
                playerJoined: 1,
                ladderStart: 1,
            })
            .populate({ path: "playerJoined.UserOrTeam" })
            .lean();
        const checkAlreadyExist = await laddersModel.find({
            $and: [{ "playerJoined.UserOrTeam": objectId(teamidoruserid) }, { _id: ladder_id }],
        });
        if (checkAlreadyExist.length > 0) {
            isValid = false;
            errors.already = "You are already exist in this ladder !!";
        } else if (gameType === "5vs5") {
            // If the game type is 5vs5 then check , some members are exist or not in another team !!
            const { isValidMember, existNames } = SomeMembersExistInTournaMent(teams, playerJoined);
            if (!isValidMember) {
                isValid = false;
                errors.already = ` Your team members ${existNames.join()} are already exist in this ladder with another team`;
            }
        }
        //Cheking the membership type
        const isMyMembership = IsMemberShip(ispremium, ispremiumadvnaced);
        if (isMyMembership !== ladderType) {
            isValid = false;
            errors.invalid_membership = `This ladder is only for ${isMyMembership} users!!`;
        }
        return { isValid, errors, gameType };
    } catch (error) {
        console.log(error);
        return { isValid: false, errors: { unexpected: "Unexpected error !!" } };
    }
};

export const ChallengeInLadderValidation = async (ladderid, fromId, toId) => {
    try {
        let isValid = true;
        let errors = {};
        const { gameType, title } = await laddersModel.findById(ladderid);
        const checkAlreadyExist = await laddersModel.find({
            $and: [
                { "playerJoined.UserOrTeam": objectId(toId) },
                { "playerJoined.UserOrTeam": objectId(fromId) },
                { _id: ladderid },
            ],
        });

        if (checkAlreadyExist.length <= 0) {
            errors.existence = `Unexpected error someone not exists in this ladder !!`;
            isValid = false;
        }
        return { isValid, errors, gameType, title };
    } catch (error) {
        return { isValid: false, errors: { unexpected: "Unexpected error !!" } };
    }
};

export const ValidateJoinTeamFinder = async (userid) => {
    try {
        let isValid = true;
        let errors = {};
        const CheckAlreadyExist = await scoutingAreaModel.findOne({ joinedUser: userid });
        if (CheckAlreadyExist) {
            isValid = false;
            errors.isAlready = "You already exist in the scouting area !!";
        }
        return { isValid, errors };
    } catch (error) {
        return { isValid: false, errors: { unexpected: "Unexpected error !!" } };
    }
};

export const validateThumb = async (roomid, userid) => {
    try {
        let isValid = true;
        let errors = {};
        let roomType;

        const checkExistRoom = await roomModel.findById(roomid);
        const checkExistHubRoom = await hubsModel.findById(roomid);

        if (checkExistRoom) {
            const { thumbs } = checkExistRoom;
            roomType = "room";
            const checkExist = thumbs.filter((el) => el === userid);
            if (checkExist.length > 0) {
                isValid = false;
                errors.already = "You already voted in this game !";
            }
        }
        if (checkExistHubRoom) {
            const { thumbs } = checkExistHubRoom;
            roomType = "hubroom";
            const checkExist = thumbs.filter((el) => el === userid);
            if (checkExist.length > 0) {
                isValid = false;
                errors.already = "You already voted in this game !";
            }
        }

        return { isValid, errors, roomType };
    } catch (error) {
        console.log(error);
        return { isValid: false, errors: { unexpected: "Unexpected error !!" } };
    }
};

export const validateReport = async (roomid, reportedBy, reportedTo) => {
    try {
        let isValid = true;
        let errors = {};
        let roomType;

        const checkExistRoom = await roomModel.findById(roomid).populate({ path: "reports" });
        const checkExistHubRoom = await hubsModel.findById(roomid).populate({ path: "reports" });

        if (checkExistRoom) {
            const { reports } = checkExistRoom;
            roomType = "room";
            const checkExist = reports.filter(
                (el) =>
                    el.reportedBy.toString() === reportedBy.toString() &&
                    el.reportedTo.toString() === reportedTo.toString()
            );
            if (checkExist.length > 0) {
                isValid = false;
                errors.already = "You already reported this player !";
            }
        }
        if (checkExistHubRoom) {
            const { reports } = checkExistHubRoom;
            roomType = "hubroom";
            const checkExist = reports.filter(
                (el) =>
                    el.reportedBy.toString() === reportedBy.toString() &&
                    el.reportedTo.toString() === reportedTo.toString()
            );
            if (checkExist.length > 0) {
                isValid = false;
                errors.already = "You already reported this player !";
            }
        }
        return { isValid, errors, roomType };
    } catch (error) {
        console.log(error);
        return { isValid: false, errors: { unexpected: "Unexpected error !!" } };
    }
};

export const ValidateWithdrawRequest = async (data) => {
    try {
        const {
            tokenData: { userid },
            amount,
        } = data;
        let isValid = true;
        let errors = {};
        const { onsiteWallet } = await userModel.findById(userid).lean();
        const walletAmount = onsiteWallet ? onsiteWallet : 0;
        if (!walletAmount) {
            isValid = false;
            errors.invalid = "Invalid amount!";
        } else if (walletAmount < 10) {
            isValid = false;
            errors.invalid = "You need atleast $10.00 in your wallet to make a withdraw !!";
        }
        if (amount > walletAmount) {
            isValid = false;
            errors.invalid = "Unexpected amount request !!";
        }
        return { isValid, errors };
    } catch (error) {
        console.log(error);
        return { isValid: false, errors: { unexpected: "Unexpected error !!" } };
    }
};
