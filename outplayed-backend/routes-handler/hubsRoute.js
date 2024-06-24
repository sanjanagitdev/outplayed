import express from 'express';
import { userAuthCheck, checkForLoggedIn } from '../middleware/checkAuth';
import {
  CheckValidateHubCreate,
  validateHubJoin,
  objectId,
} from '../functions/validations';
import {
  CheckMinimumPlayers,
  CheckPlayerPick,
  CreateHubsSearchObject,
} from '../functions/hubsfunctions';
//import userModel from "../models/user";
import hubsModel from '../models/hubs';
import joinForPlayModel from '../models/joinforplay';
import { makeDb, checkIfEmpty, SetAsNormal } from '../functions';
import userModel from '../models/user';
import commentModel from '../models/comment';
import roomModel from '../models/room';

const router = new express.Router();
const HubsRoute = (io) => {
  router.post('/createhubs', userAuthCheck, async (req, res) => {
    /**
   *This api route is used to create hubs ,(Only premium users can create hubs).
    The Premium player will have the ability to create hubs with which they can choose
    whether to play only Premiums, Premiums and Advanced or all players with a
    minimum prestige to enter
   */
    try {
      let { isVlaid, errors, payload } = await CheckValidateHubCreate(req);
      console.log(isVlaid, errors, payload);
      if (!isVlaid) {
        res.send({ code: 201, errors });
        return;
      }
      const joinedFirst = await joinForPlayModel.create({
        userid: payload.createdby,
        jointype: 'hub',
      });
      payload.joinedplayers = [joinedFirst._id];
      const createHub = await hubsModel.create(payload);
      await joinForPlayModel.updateOne(
        { _id: joinedFirst._id },
        { hubid: createHub._id }
      );
      io.emit('GetCreatedHubs', createHub);
      res.send({
        code: 200,
        msg: 'Hubs created successfully',
        createHub,
      });
    } catch (e) {
      res.send({
        code: 500,
        msg: 'Internal server error!!',
      });
    }
  });

  router.get('/listgather', async (req, res) => {
    /**
     * This api route is used to get the hubs list on the hubs page
     * page skip and limit
     */
    try {
      const { skip, limit } = req.query;
      const searchby = CreateHubsSearchObject(req);

      const gatherslist = await hubsModel
        .find(searchby, {
          name: 1,
          prestige: 1,
          premium: 1,
          premiumadvanced: 1,
          joinedplayers: 1,
          running: 1,
          team1: 1,
          team2: 1,
          cancelled: 1,
          maps: 1,
        })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .sort({ _id: -1 })
        .lean();

      const filterdData = gatherslist.filter(
        (el) => (el.premiumadvanced || el.premium) && !el.running && !el.byadmin
      );
      const idArray = filterdData.map((hubs) => hubs._id);

      const hubsList = gatherslist.filter((item) => {
        return idArray.indexOf(item._id) === -1;
      });

      const MonthlyRank = await SetAsNormal('hub');
      res.send({
        code: 200,
        gatherslist: hubsList,
        MonthlyRank,
      });
    } catch (e) {
      console.log(e);
      res.send({
        code: 500,
        msg: 'Internal server error!!',
      });
    }
  });

  router.get('/hubsdetail/:id', checkForLoggedIn, async (req, res) => {
    try {
      const { userid } = req.body;
      const { id } = req.params;
      const getHubsData = await hubsModel
        .findById(id, {
          name: 1,
          joinedplayers: 1,
          team1: 1,
          team2: 1,
          running: 1,
          cancelled: 1,
          chats: 1,
          checkfull: 1,
          mapvoting: 1,
          maps: 1,
          joinip: 1,
        })
        .populate({
          path: 'joinedplayers',
          select: {
            userid: 1,
          },
          populate: {
            path: 'userid',
            select: {
              username: 1,
              useravatar: 1,
              prestige: 1,
            },
          },
        })
        .populate({
          path: 'chats',
          populate: {
            path: 'sendby',
            select: {
              username: 1,
              prestige: 1,
              useravatar: 1,
            },
          },
        })
        .populate({
          path: 'team1',
          select: {
            userid: 1,
            iscaptain: 1,
            result: 1,
          },
          populate: {
            path: 'userid',
            select: {
              username: 1,
              useravatar: 1,
              prestige: 1,
            },
          },
        })
        .populate({
          path: 'team2',
          select: {
            userid: 1,
            iscaptain: 1,
            result: 1,
          },
          populate: {
            path: 'userid',
            select: {
              username: 1,
              useravatar: 1,
              prestige: 1,
            },
          },
        })
        .populate({
          path: 'comments',
          options: {
            sort: {
              _id: -1,
            },
          },
          populate: {
            path: 'commentby',
            select: {
              username: 1,
              useravatar: 1,
            },
          },
        })
        .lean();
      res.send({
        code: 200,
        getHubsData,
        userid,
      });
    } catch (e) {
      console.log(e);
      res.send({
        code: 500,
        msg: 'Internal server error!!',
      });
    }
  });

  router.put('/joinhub', userAuthCheck, async (req, res) => {
    try {
      /**
       * This api is used to join the users in the hubs
       * In this api we also need to check the user membership (premium,premiumadvanced,normal)
       */
      const {
        tokenData: { userid },
        hubid,
      } = req.body;
      const { isVlaid, errors, joinedData } = await validateHubJoin(
        userid,
        hubid
      );
      if (!isVlaid) {
        res.send({ code: 201, errors });
        return;
      }
      const join = await joinForPlayModel.create({
        userid,
        hubid,
        jointype: 'hub',
      });
      await hubsModel.updateOne(
        { _id: hubid },
        {
          $push: {
            joinedplayers: join._id,
          },
        }
      );
      io.in(hubid).emit('PlayerJoinInHub', joinedData);
      CheckMinimumPlayers(io, hubid);
      res.send({ code: 200, msg: 'Successfully joined in the hub' });
    } catch (e) {
      res.send({
        code: 500,
        msg: 'Internal server error!!',
      });
    }
  });

  router.put('/pickplayer', userAuthCheck, async (req, res) => {
    try {
      const {
        pickplayerid,
        hubid,
        tokenData: { userid },
      } = req.body;
      let object;
      let team;
      const { joinedplayers, team1, team2 } = await hubsModel
        .findOne({ $and: [{ _id: hubid }, { checkfull: 'true' }] })
        .populate({
          path: 'joinedplayers',
          populate: {
            path: 'userid',
            select: {
              username: 1,
              useravatar: 1,
              prestige: 1,
            },
          },
        })
        .populate({ path: 'team1' })
        .populate({ path: 'team2' })
        .lean();
      const FilterPlayerExist = joinedplayers.filter(
        (el) => el.userid._id.toString() === pickplayerid.toString()
      );
      const FilterTeam1Exist = team1.filter(
        (el) => el.userid.toString() === userid.toString() && el.iscaptain
      );
      const FilterTeam2Exist = team2.filter(
        (el) => el.userid._id.toString() === userid.toString() && el.iscaptain
      );
      //filter another captain for chance
      const anotherchance = [
        ...team1.filter((el) => el.iscaptain),
        ...team2.filter((el) => el.iscaptain),
      ].filter((element) => element.userid.toString() !== userid);
      if (FilterPlayerExist.length === 0) {
        res.send({
          code: 201,
          msg: 'Unexpected error !!',
        });
        return;
      }
      if (FilterTeam1Exist.length > 0) {
        object = {
          $pull: {
            joinedplayers: objectId(FilterPlayerExist[0]._id),
          },
          $push: {
            team1: objectId(FilterPlayerExist[0]._id),
          },
        };
        team = 'team1';
      } else if (FilterTeam2Exist.length > 0) {
        object = {
          $pull: {
            joinedplayers: objectId(FilterPlayerExist[0]._id),
          },
          $push: {
            team2: objectId(FilterPlayerExist[0]._id),
          },
        };
        team = 'team2';
      }
      if (object && team) {
        await hubsModel.updateOne({ _id: hubid }, object);
        io.in(hubid).emit('PickPlayerEvent', {
          player: FilterPlayerExist[0],
          team,
          pickplayerid,
        });
        CheckPlayerPick(hubid, anotherchance[0].userid, io, 'pick');
        res.end();
      } else {
        res.send({
          code: 201,
          msg: 'Unexpected error !!',
        });
      }
    } catch (e) {
      console.log(e);
      res.send({
        code: 500,
        msg: 'Internal server error!!',
      });
    }
  });

  router.put('/mapvote', userAuthCheck, async (req, res) => {
    try {
      const {
        body: {
          tokenData: { userid },
          hubid,
          mapname,
        },
      } = req;
      const HubsData = await hubsModel
        .findById(hubid)
        .populate({ path: 'team1' })
        .populate({ path: 'team2' })
        .lean();
      let isCaptain = false;
      if (HubsData) {
        let { team1, team2 } = HubsData;
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
          await hubsModel.updateOne(
            {
              _id: hubid,
              'maps.title': mapname,
            },
            {
              $set: {
                'maps.$.open': false,
              },
            }
          );
          io.in(hubid).emit('PickMapEvent', mapname);
          CheckPlayerPick(hubid, anotherchance[0].userid, io, 'mappick');
          // checkMapVote(roomid, ids, io);
          res.end();
        } else {
          res.send({
            code: 201,
            msg: '',
          });
        }
      } else {
        res.send({
          code: 404,
          msg: 'Room not found !!!',
        });
      }
    } catch (e) {
      console.log(e);
      res.send({
        code: 500,
        msg: 'Internal server error!!',
      });
    }
  });

  router.get('/getStats', async (req, res) => {
    let db;
    try {
      db = makeDb('5vs5');
      //When we wants to get data from roomModel ,we need roomModel
      let id = '5fb9094f499c034d0d12f8c9';
      let { team1, team2 } = await roomModel
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
      // let { team1, team2 } = await hubsModel
      //     .findById(id, {
      //         userid: 1,
      //     })
      //     .populate({
      //         path: "team1",
      //         populate: {
      //             path: "userid",
      //             select: {
      //                 steamid: 1,
      //             },
      //         },
      //     })
      //     .populate({
      //         path: "team2",
      //         populate: {
      //             path: "userid",
      //             select: {
      //                 steamid: 1,
      //             },
      //         },
      //     })
      //     .lean();
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
            // await joinForPlayModel.updateOne(
            //     {
            //         hubid: objectId(id),
            //         userid: userid,
            //     },
            //     {
            //         result: el,
            //         running: false,
            //     }
            // );
            // await userModel.updateOne(
            //     {
            //         _id: userid,
            //     },
            //     {
            //         $inc: {
            //             monthlyhubpoint: el.points,
            //         },
            //     }
            // );
          }
        });
        // await hubsModel.updateOne(
        //     {
        //         _id: id,
        //     },
        //     {
        //         running: false,
        //     }
        // );
        // await joinForPlayModel.updateMany(
        //     {
        //         hubid: objectId(id),
        //     },
        //     {
        //         running: false,
        //     }
        // );

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
      res.json({
        code: 200,
        msg: 'connected',
        someRows,
      });
    } catch (e) {
      console.log(e);
      db.close();
      res.send({
        code: 500,
        msg: 'Some error has occured, please try again',
      });
    }
  });

  router.post('/postcomment', userAuthCheck, async (req, res) => {
    try {
      /**
       * This api route is used to post the comments on the completed hub
       * We returned posted comment in the response
       */
      const { comment, hubid } = req.body;
      const { tokenData } = req.body;
      const { isValid } = checkIfEmpty({ comment, hubid });
      if (isValid) {
        let { useravatar, username, steamavatar } = await userModel.findById(
          tokenData.userid
        );
        let commentData = new commentModel({
          commentby: tokenData.userid,
          comment,
          date: Date.now(),
        });
        const saveComment = await commentData.save();
        await hubsModel.updateOne(
          {
            _id: hubid,
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
          msg: 'commented successfully',
        });
      } else {
        res.send({
          code: 201,
          msg: 'Invalid request',
        });
      }
    } catch (e) {
      res.send({
        code: 500,
        msg: 'Internal server error!!',
      });
    }
  });

  router.delete('/exitfromhub/:hubid', userAuthCheck, async (req, res) => {
    try {
      const { hubid } = req.params;
      const { userid } = req.body.tokenData;
      const { joinedplayers } = await hubsModel.findById(hubid).populate({
        path: 'joinedplayers',
        match: {
          userid: objectId(userid),
        },
      });

      console.log(joinedplayers);
      if (joinedplayers.length > 0) {
        const { _id: joinid } = joinedplayers[0];
        await hubsModel.updateOne(
          { _id: hubid },
          { $pull: { joinedplayers: objectId(joinid) } }
        );
        await joinForPlayModel.deleteOne({ _id: joinid });
        io.in(hubid).emit('ExitFromHub', joinid);
        res.send({
          code: 200,
          msg: 'You are successfully exited from this hub',
          joinid,
        });
      } else {
        res.send({
          code: 201,
          msg: 'Unexpected error!!',
        });
      }
    } catch (e) {
      res.send({
        code: 500,
        msg: 'Internal server error!!',
      });
    }
  });
  return router;
};
export default HubsRoute;
