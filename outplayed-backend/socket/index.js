import hubsModel from '../models/hubs';
import chatModel from '../models/chats';
import userModel from '../models/user';
import commentModel from '../models/comment';
import postModel from '../models/post';
import { verifyJwt } from '../functions';
import { CheckUserExistIn } from '../functions/validations';
import { CheckInWhichTeamUserIs } from '../functions/matchmakingfunction';
import roomModel from '../models/room';
export const SocketConnection = (io) => {
  io.notification = [];
  io.users = [];
  io.on('connection', async (socket) => {
    try {
      console.log('connected');
      let token = socket.request._query['token'];
      if (token !== 'undefined' && token !== 'null') {
        const checkVeify = await verifyJwt(token);
        if (checkVeify) {
          //code for notification
          // let socketid = socket.id;
          // socketid = setInterval(() => {
          //   //code for notifications......
          //   // console.log("socket", socket);
          //   notification(socket, checkVeify.userid);
          // }, 1000);
          // io.notification.push({
          //   [socket.id]: socketid,
          // });
          // code for online users
          let lastSocketData = io.users;
          lastSocketData.push(checkVeify.userid);
          io.users = lastSocketData;
          socket.customId = checkVeify.userid;
          await userModel.updateOne(
            {
              _id: checkVeify.userid,
            },
            {
              online: true,
            }
          );
        }
      }
      /**
       * You can call join to subscribe the socket to a given channel
       */
      socket.on('join', (id) => {
        socket.join(id);
      });
      /**
       * This method is used for chat between hubs joined players
       */
      socket.on('HubChat', async (messageData) => {
        try {
          const { token, message, hubid } = messageData;

          const checkVeify = await verifyJwt(token);

          if (checkVeify) {
            const { userid } = checkVeify;

            const checkExist = await CheckUserExistIn(userid, hubid);

            if (checkExist) {
              let { prestige, username } = await userModel.findById(userid, {
                prestige: 1,
                username: 1,
              });
              let messages = {
                sendby: { prestige, username, _id: userid },
                message,
                createdAt: new Date(),
              };
              io.in(hubid).emit('GetHubsChat', messages);
              const storeChat = await chatModel.create({
                sendby: userid,
                message,
              });
              await hubsModel.updateOne(
                { _id: hubid },
                { $push: { chats: storeChat._id } }
              );
            }
          }
        } catch (error) {
          console.log(error);
          return 0;
        }
      });

      socket.on('MatchMakingRoomChat', async (messageData) => {
        try {
          const { token, message, roomid } = messageData;
          const checkVeify = await verifyJwt(token);
          if (checkVeify) {
            const { userid } = checkVeify;
            const { gamemode } = await roomModel.findById(roomid, {
              gamemode: 1,
            });
            let { isValid, team } = await CheckInWhichTeamUserIs(
              roomid,
              userid
            );
            if (!isValid) {
              return;
            }
            team = gamemode === '5vs5' ? team : 'teamone';
            let { prestige, username } = await userModel.findById(userid, {
              prestige: 1,
              username: 1,
            });
            let messages = {
              sendby: { prestige, username, _id: userid },
              message,
              createdAt: new Date(),
            };
            io.in(roomid).emit('GetHubsChat', { messages, team });
            const storeChat = await chatModel.create({
              sendby: userid,
              message,
            });
            await roomModel.updateOne(
              { _id: roomid },
              { $push: { [team]: storeChat._id } }
            );
          }
        } catch (error) {
          console.log(error);
          return 0;
        }
      });

      socket.on('ScoutingAriaChat', async (messageData) => {
        try {
          const { token, message, roomId, scoutingId } = messageData;
          const checkVeify = await verifyJwt(token);
          if (checkVeify) {
            const { userid } = checkVeify;
            console.log(
              'message, roomid, scoutingId =>>',
              userid,
              message,
              roomId,
              scoutingId
            );
            io.in(roomId).emit('ScoutingAriaChat', {
              userid,
              message,
              roomId,
              scoutingId,
            });
          }
        } catch (error) {
          return error;
        }
      });

      socket.on('SendComment', async ({ message, postid, webtoken }) => {
        console.log(message, 'message=>');
        const checkVeifyUser = await verifyJwt(webtoken);
        console.log(checkVeifyUser);
        if (checkVeifyUser) {
          console.log(checkVeifyUser);
          const { userid } = checkVeifyUser;
          const createComment = await commentModel.create({
            comment: message,
            commentby: userid,
          });
          await postModel.updateOne(
            { _id: postid },
            {
              $push: {
                comments: createComment._id,
              },
            }
          );
          if (createComment) {
            const getCommentData = await commentModel
              .findById(
                { _id: createComment._id },
                { _id: 0, comment: 1, createdAt: 1, commentby: 1 }
              )
              .populate({
                path: 'commentby',
                select: {
                  _id: 0,
                  username: 1,
                  useravatar: 1,
                },
              });
            console.log('getCommentData', getCommentData);
            io.emit('GetCommentData', { getCommentData, postid });
          }
        }
      });
    } catch (e) {
      return 0;
    }

    socket.on('disconnect', async () => {
      try {
        console.log('disconnected', socket.id);
        // code for clear user timer
        // let filtered = [...io.notification];
        // let mydata = filtered.filter((el) => Object.keys(el)[0] == socket.id);
        // filtered = filtered.filter((el) => Object.keys(el)[0] !== socket.id);
        // clearInterval(Object.values(mydata[0])[0]);
        // io.notification = filtered;
        //code for ofline the user when disconnected
        const lastSockets = io.users;
        let filteredSockets = lastSockets.filter(
          (el) => el === socket.customId
        );
        if (filteredSockets.length > 0) {
          let index = lastSockets.indexOf(socket.customId);
          if (index !== -1) lastSockets.splice(index, 1);
          io.users = lastSockets;
          if (filteredSockets.length === 1) {
            await userModel.updateOne(
              {
                _id: socket.customId,
              },
              {
                online: false,
              }
            );
          }
          socket.customId = null;
        }
      } catch (e) {
        return 0;
      }
    });
  });
};
