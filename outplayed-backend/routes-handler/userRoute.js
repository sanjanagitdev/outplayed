import express from 'express';
import passport from 'passport';
import * as SteamUserInfo from 'node-steam-userinfo';
import paypal from 'paypal-rest-sdk';
import multiparty from 'multiparty';
import fs from 'fs';
import fileType from 'file-type';
import crypto from 'crypto';
import userModel from '../models/user';
import friendsModel from '../models/friends';
import teamModel from '../models/team';
import groupModel from '../models/group';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import {
	hashPassword,
	verifyPassword,
	signJwt,
	sendMail,
	checkIfEmpty,
	sendSteamResponse,
	CreateNotification,
	uploadFile,
	sendInvitation,
	compareArray,
	CheckAlreadyJoined,
	ConnectInvite,
	RemoveFromOldGroup,
	CreateGroup,
	NotifYAllGroupMembers,
	GetRequiredDataOnThePages,
	GetCalculateStatistics,
	CheckIsPremiumPlayer,
	CreateFilterObject,
	LastMatchesData,
} from '../functions/index';
import {
	objectId,
	RemoveFromOrGroupValidate,
	RemoveTeam,
	ValidateJoinTeamFinder,
	validateThumb,
	validateReport,
	ValidateWithdrawRequest,
} from '../functions/validations';
import {
	userAuthCheck,
	checkForLoggedIn,
	userAuthCheckFirst,
} from '../middleware/checkAuth';
import { client, server } from '../config/keys';
import notificationModel from '../models/notification';
import TicketModel from '../models/ticket';
import scoutingAreaModel from '../models/scoutingarea';
import chatModel from '../models/chats';
import roomModel from '../models/room';
import hubsModel from '../models/hubs';
import gameReportModel from '../models/gamereports';
import transactionModel from '../models/transaction';
import withdrawModel from '../models/withdrawls';
import { interFunction3 } from '../functions/hubsfunctions';
import {
	Create_Paypal_Recurring_Agreement,
	PaymentSuccess,
} from '../functions/subscription';

import productModel from '../models/product';
import pruchesitemModel from '../models/pruchesitem';
import commentModel from '../models/comment';
import categoryModel from '../models/categorys';
import postModel from '../models/post';
import tournamentModel from '../models/tournament';
import { FetchObject } from '../config/config';
import joinForPlayModel from '../models/joinforplay';

paypal.configure({
	mode: process.env.PAYPAL_MODE, //sandbox or live
	client_id: process.env.PAY_PAL_CLIENT_ID,
	client_secret: process.env.PAY_PAL_CLIENT_SECRET,
});

const router = new express.Router();
const UserRoute = (io) => {
	/**
	 * This is the user route handler all the user specific
	 * apis are performed from here
	 */

	/**
	 * This get route is used for login via steam
	 * using passport openid strategy
	 */
	router.get('/auth/steam', passport.authenticate('openid'));

	router.get(
		'/auth/steam/return',
		passport.authenticate('openid', {
			failureRedirect: `${client}?steamlogin=false`,
		}),
		async (req, res) => {
			try {
				const { user } = req;
				SteamUserInfo.setup(process.env.STEAM_KEY);
				const userData = await SteamUserInfo.getUserDetails(user.steamID);
				const { steamid, personaname, profileurl, avatarmedium } = userData;
				const checkUser = await userModel.findOne({
					steamid,
				});
				if (checkUser) {
					await userModel.updateOne(
						{
							steamid,
						},
						{
							username: personaname,
							useravatar: avatarmedium ? avatarmedium : '',
						}
					);
					sendSteamResponse(checkUser, res, client);
				} else {
					const user = new userModel({
						steamid,
						username: personaname,
						useravatar: avatarmedium ? avatarmedium : '',
						profileurl: profileurl ? profileurl : '',
						loginviasteam: true,
						password: uuidv4(),
					});
					const savedUser = await user.save();
					sendSteamResponse(savedUser, res, client);
					// await CreateGroup(savedUser._id);
				}
			} catch (e) {
				res.redirect(`${client}?steamlogin=false`);
			}
		}
	);
	router.post('/register', async (req, res) => {
		/**
		 * This is the user api for register user on the platform when user registerd
		 * a verfication main send to the user
		 * There is a function (sendmail). which is used to send mail
		 */
		try {
			let { username, email, password, id } = req.body;
			let registerObject = {
				username,
				email,
				password,
			};
			const { isValid } = checkIfEmpty(registerObject);
			if (isValid) {
				password = await hashPassword(password);
				registerObject.password = password;
				const svaeRegisteration = new userModel(registerObject);
				const saved = await svaeRegisteration.save();
				const link =
					'http://' +
					req.get('host') +
					'/api/user-route-handler/verify?id=' +
					saved._id;
				await sendMail(req, link, 'register');
				// await CreateGroup(saved._id);
				if (id) {
					ConnectInvite(id, saved._id, io);
				}
				res.send({
					code: 200,
					msg: 'Register Successfully and Verification Mail Send',
				});
			} else {
				res.send({
					code: 422,
					msg: 'Invalid request !!',
				});
			}
		} catch (e) {
			res.send({
				code: 500,
				msg: e.message,
			});
		}
	});

	router.get('/verify', async (req, res) => {
		/**
		 * This is the verfiy user api. when user click verify link in there email
		 * its handle that request and verify user
		 */
		try {
			const host = req.get('host');
			if (req.protocol + '://' + req.get('host') == 'http://' + host) {
				if (req.query.id) {
					const findUser = await userModel
						.findOne({
							_id: req.query.id,
						})
						.lean();
					if (findUser) {
						const { isVerified, _id } = findUser;
						if (isVerified) {
							res.redirect(
								`http://15.188.166.158:3000/?verify=alreadyverified`
							);
						} else {
							await userModel.updateOne(
								{
									_id,
								},
								{
									isVerified: true,
								}
							);
							res.redirect(`http://15.188.166.158:3000/?verify=success`);
						}
					}
				} else {
					res.send({
						code: 500,
						msg: 'User Not found',
					});
				}
			}
		} catch (error) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});
	router.post('/login', async (req, res) => {
		try {
			/**
			 * This api is used for login the user on the platform
			 */
			const { email, password } = req.body;
			const loginUser = await userModel.findOne({
				email,
			});
			if (loginUser) {
				if (loginUser.isVerified) {
					const cmp = await verifyPassword(password, loginUser.password);
					if (cmp) {
						const token = signJwt(loginUser._id, loginUser.email);
						res.send({
							code: 200,
							msg: 'Login successfully',
							token: token,
							userid: loginUser._id,
						});
					} else {
						res.send({
							code: 204,
							msg: 'Incorrect password',
						});
					}
				} else {
					res.send({
						code: 204,
						msg: 'Please verify your email and then try to login',
					});
				}
			} else {
				res.send({
					code: 404,
					msg: 'user Not found',
				});
			}
		} catch (error) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});
	router.patch('/:_id', userAuthCheck, async (req, res) => {
		/**
		 * This api used to update the user details also when user update there email
		 * we send a email to re-verify the email
		 */
		try {
			const { name, email, password, phone, dob } = req.body;
			const { _id } = req.params;
			const findUser = await userModel.findOne({
				_id,
			});
			const link =
				'http://' +
				req.get('host') +
				'/api/user-route-handler/verify?id=' +
				findUser.id;
			if (email == findUser.email) {
				res.send({
					Code: 409,
					msg: 'Email Already Existed',
				});
			} else {
				password = password ? await hashPassword(password) : findUser.password;
				const changeobj = {
					name,
					email,
					password,
					phone,
					dob,
				};
				await userModel.updateOne(
					{
						_id,
					},
					changeobj
				);
				await sendMail(req, link, 'updateemail');
				res.send({
					code: 200,
					msg: 'Updated Successfully',
				});
			}
		} catch (error) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.post('/forgetPass', async (req, res) => {
		try {
			const { email } = req.body;
			const findUser = await userModel
				.findOne({
					email,
				})
				.lean();
			if (findUser) {
				const changeValue = {
					forgetPassHash: await hashPassword(JSON.stringify(findUser._id)),
					forgetPassCreatedAt: new Date()
						.toISOString()
						.replace(/T/, ' ')
						.replace(/\..+/, ''),
				};
				const updateHash = await userModel.updateOne(
					{
						email,
					},
					changeValue
				);
				if (updateHash) {
					const link = `http://15.188.166.158:3000/?forgethash=${changeValue.forgetPassHash}`;
					const mail = await sendMail(req, link, 'forgetpass');
					if (mail) {
						res.send({
							code: 200,
							msg: 'Change password link sended to your registered email',
						});
					}
				}
			} else {
				res.send({
					code: 404,
					msg: 'Email not found',
				});
			}
		} catch (error) {
			res.send({
				code: 500,
				msg: error.message,
			});
		}
	});
	router.post('/reset', async (req, res) => {
		try {
			const { password, token } = req.body;
			const userData = await userModel.findOne({
				forgetPassHash: token,
			});
			if (userData) {
				let currentdatetime = new Date()
					.toISOString()
					.replace(/T/, ' ')
					.replace(/\..+/, '');
				let olddatetime = userData.forgetPassCreatedAt;
				let date1 = new Date(currentdatetime);
				let date2 = new Date(olddatetime);
				let diff = Math.trunc(Math.abs(date1 - date2) / 36e5);
				if (diff < 24) {
					await userModel.updateOne(
						{
							_id: userData._id,
						},
						{
							forgetPassHash: 'done',
							password: await hashPassword(password),
						}
					);
					res.send({
						code: 200,
						msg: 'Password reset sucessfully',
					});
				} else {
					res.send({
						code: 500,
						msg: 'reset password link was expired',
					});
				}
			} else {
				res.send({
					code: 500,
					msg: 'Invalid link',
				});
			}
		} catch (error) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.get('/checkauth', userAuthCheckFirst, async (req, res) => {
		try {
			const {
				body: {
					tokenData: { userid },
				},
			} = req;
			const userdata = await userModel
				.findById(userid, {
					username: 1,
					useravatar: 1,
					notification: 1,
					coins: 1,
					invitedfriends: 1,
					ispremium: 1,
					ispremiumadvnaced: 1,
					prestige: 1,
					prestige1vs1: 1,
					laddersChallenges: 1,
					onsiteWallet: 1,
					withdrawRequests: 1,
					transaction: 1,
					paypalAccount: 1,
					isturnament: 1,
					isladders: 1,
					friends: 1,
					receivedRequests: 1,
					sentRequests: 1,
					following: 1,
					nickname: 1,
					dob: 1,
					mainteam: 1,
					nationality: 1,
				})
				.populate({
					path: 'notification',
					options: {
						sort: {
							_id: -1,
						},
					},
					populate: {
						path: 'sender',
						select: {
							username: 1,
							useravatar: 1,
							topic: 1,
							type: 1,
							seen: 1,
						},
					},
				})
				.populate({
					path: 'teams',
					select: {
						name: 1,
						teamlogo: 1,
						creator: 1,
					},
					options: {
						sort: {
							_id: -1,
						},
					},
					populate: {
						path: 'joinedmembers',
						select: {
							username: 1,
							useravatar: 1,
							online: 1,
						},
					},
				})
				.populate({
					path: 'friends',
					select: {
						bothfriends: 1,
						_id: 0,
					},
					options: {
						sort: {
							_id: -1,
						},
					},
					populate: {
						path: 'bothfriends',
						select: {
							username: 1,
							useravatar: 1,
							online: 1,
							group: 1,
							profileurl: 1,
						},
						match: {
							_id: {
								$ne: objectId(userid),
							},
						},
					},
				})
				.populate({
					path: 'group',
					select: {
						invitedmembers: 1,
						members: 1,
						creator: 1,
					},
					populate: {
						path: 'invitedmembers',
						select: {
							username: 1,
							useravatar: 1,
						},
					},
				})
				.populate({
					path: 'group',
					select: {
						joinedmembers: 1,
						members: 1,
						creator: 1,
					},
					populate: {
						path: 'joinedmembers',
						select: {
							username: 1,
							useravatar: 1,
						},
					},
				})
				.populate({
					path: 'postedtickets',
					select: {
						subject: 1,
						description: 1,
						status: 1,
						createdAt: 1,
						replies: 1,
						category: 1,
					},
					options: {
						sort: {
							_id: -1,
						},
					},
				})
				.populate({
					path: 'laddersChallenges',
					populate: {
						path: 'challengeBy',
						select: {
							username: 1,
							useravatar: 1,
						},
					},
				})
				.populate({
					path: 'laddersChallenges',

					populate: {
						path: 'challengeTo',
						select: {
							username: 1,
							useravatar: 1,
						},
					},
				})
				.populate({
					path: 'laddersChallenges',

					populate: {
						path: 'ladderid',
						select: {
							title: 1,
							banner: 1,
						},
					},
				})
				.populate({
					path: 'withdrawRequests',
					select: { approved: 1, amount: 1, _id: 1, createdAt: 1 },
				})
				.populate({
					path: 'transaction',
					select: {
						_id: 1,
						transaction_data: {
							id: 1,
							state: 1,
						},
						total: 1,
						transaction_type: 1,
						createdAt: 1,
					},
				})
				.lean();
			const getUserStats1vs1 = await GetCalculateStatistics(userid, '1vs1');
			const getUserStats5vs5 = await GetCalculateStatistics(userid, '5vs5');
			res.send({
				code: 200,
				userdata,
				getUserStats1vs1,
				getUserStats5vs5,
			});
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Error in user auth check',
			});
		}
	});

	router.post('/sendRequest', userAuthCheck, async (req, res) => {
		try {
			const {
				body: {
					tokenData: { userid },
					_id,
				},
			} = req;
			console.log(_id);
			return;
			if (_id === userid) {
				res.send({
					code: 400,
					msg: 'unexpected error',
				});
			} else {
				let checkValid = true;
				let msg = null;
				let { receivedRequests, sentRequests, friends } = await userModel
					.findById(userid, {
						receivedRequests: 1,
						sentRequests: 1,
						friends: 1,
					})
					.populate({
						path: 'friends',
					})
					.lean();
				sentRequests = sentRequests ? sentRequests : [];
				receivedRequests = receivedRequests ? receivedRequests : [];
				friends = friends ? friends : [];
				receivedRequests = receivedRequests.filter(
					(el) => el.toString() === _id.toString()
				);
				sentRequests = sentRequests.filter(
					(el) => el.toString() === _id.toString()
				);
				friends = friends.filter((ele) => {
					return ele.bothfriends.some(
						(elem) => elem.toString() === _id.toString()
					);
				});
				if (receivedRequests.length > 0) {
					checkValid = false;
					msg = 'This user already sended you friend request';
				} else if (sentRequests.length > 0) {
					checkValid = false;
					msg = 'You already sended friend request to this user';
				} else if (friends.length > 0) {
					checkValid = false;
					msg = 'This user is already in your friend list';
				}
				if (checkValid) {
					await userModel.updateOne(
						{
							_id,
						},
						{
							$push: {
								receivedRequests: userid,
							},
						}
					);
					await userModel.updateOne(
						{
							_id: userid,
						},
						{
							$push: {
								sentRequests: _id,
							},
						}
					);
					let topic = 'Sended you a request';
					CreateNotification(userid, _id, topic, 'sended', io);
					res.send({
						code: 200,
						msg: 'Request sended successfully',
					});
				} else {
					res.send({
						code: 500,
						msg,
					});
				}
			}
		} catch (e) {
			console.log(e);
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.post('/acceptRequest', userAuthCheck, async (req, res) => {
		try {
			const {
				body: {
					tokenData: { userid },
					_id,
				},
			} = req;
			const CreateFriends = await friendsModel.create({
				bothfriends: [userid, _id],
			});
			await userModel.updateOne(
				{
					_id: userid,
				},
				{
					$push: {
						friends: CreateFriends._id,
					},
					$pull: {
						receivedRequests: _id,
					},
				}
			);
			await userModel.updateOne(
				{
					_id,
				},
				{
					$push: {
						friends: CreateFriends._id,
					},
					$pull: {
						sentRequests: userid,
					},
				}
			);
			await notificationModel.updateOne(
				{
					$and: [
						{
							sender: objectId(_id),
						},
						{
							reciver: objectId(userid),
						},
						{
							type: 'sended',
						},
						{
							state: 'primary',
						},
					],
				},
				{
					state: 'accpet',
					seen: true,
				}
			);
			let topic = 'accepted your friend request';
			io.in(userid.toString()).emit('GetNotifications');
			CreateNotification(userid, _id, topic, 'accepted', io);
			res.send({
				code: 200,
				msg: 'Request accepted successfully',
			});
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.post('/rejectRequest', userAuthCheck, async (req, res) => {
		try {
			const {
				tokenData: { userid },
				_id,
			} = req.body;
			await userModel.updateOne(
				{
					_id: userid,
				},
				{
					$pull: {
						receivedRequests: objectId(_id),
					},
				}
			);
			await userModel.updateOne(
				{
					_id,
				},
				{
					$pull: {
						sentRequests: objectId(userid),
					},
				}
			);
			await notificationModel.updateOne(
				{
					$and: [
						{
							sender: objectId(_id),
						},
						{
							reciver: objectId(userid),
						},
						{
							type: 'sended',
						},
						{
							state: 'primary',
						},
					],
				},
				{
					state: 'reject',
					seen: true,
				}
			);
			io.in(userid.toString()).emit('GetNotifications');
			res.send({
				code: 200,
				msg: 'Request rejected successfully',
			});
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.get('/searchProfiles/:username', userAuthCheck, async (req, res) => {
		try {
			let {
				body: {
					tokenData: { userid },
				},
				params: { username },
			} = req;
			let mydetails = await userModel
				.findById(userid, {
					sentRequests: 1,
					receivedRequests: 1,
					friends: 1,
				})
				.populate({
					path: 'friends',
				})
				.lean();
			let profileList = await userModel
				.find(
					{
						$and: [
							{
								username: {
									$regex: new RegExp('^' + username.toLowerCase(), 'i'),
								},
							},
							{
								_id: {
									$ne: userid,
								},
							},
						],
					},
					{
						username: 1,
						useravatar: 1,
						prestige: 1,
						ispremium: 1,
						profileurl: 1,
						ispremiumadvnaced: 1,
					}
				)
				.lean();
			let { sentRequests, receivedRequests, friends } = mydetails;
			sentRequests = sentRequests ? sentRequests : [];
			receivedRequests = receivedRequests ? receivedRequests : [];
			friends = friends ? friends : [];
			profileList.forEach((el) => {
				let alreadySent = sentRequests.filter(
					(ele) => ele._id.toString() === el._id.toString()
				);
				let alreadyReceivedRequests = receivedRequests.filter(
					(ele) => ele._id.toString() === el._id.toString()
				);
				let alreadyFriends = friends.filter((ele) => {
					return ele.bothfriends.some(
						(elem) => elem.toString() === el._id.toString()
					);
				});
				if (alreadySent.length > 0) {
					el.requested = true;
					el.found = true;
				} else if (alreadyReceivedRequests.length > 0) {
					el.recived = true;
					el.found = true;
				} else if (alreadyFriends.length > 0) {
					el.friends = true;
					el.found = true;
				} else {
					el.found = false;
				}
			});
			res.send({
				code: 200,
				profileList,
			});
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.post('/createteam', userAuthCheck, async (req, res) => {
		const form = new multiparty.Form();
		form.parse(req, async (error, fields, files) => {
			if (error) {
				res.send({
					code: 500,
					msg: 'Internal server error!!',
				});
			}
			try {
				const { isValid } = checkIfEmpty(req.query);
				if (isValid) {
					const { path } = files.file ? files.file[0] : {};
					const { name, tag, country } = req.query;
					const {
						tokenData: { userid: creator },
					} = req.body;
					if (path) {
						const buffer = fs.readFileSync(path);
						const type = await fileType.fromBuffer(buffer);
						const timestamp = Date.now().toString();
						const fileName = `bucketFolder/${timestamp}-lg`;
						const hash = crypto
							.createHash('md5')
							.update(fileName)
							.digest('hex');
						const data = await uploadFile(buffer, hash, type, 'teamimages');
						const teamdata = await teamModel.create({
							name,
							tag,
							country,
							teamlogo: data.Location,
							creator,
							joinedmembers: [creator],
						});
						await userModel.updateOne(
							{
								_id: creator,
							},
							{
								$push: {
									teams: teamdata._id,
								},
							}
						);
						res.send({
							code: 200,
							msg: 'Team created successfully',
							teamid: teamdata._id,
						});
					} else {
						const teamdata = await teamModel.create({
							name,
							tag,
							country,
							creator,
							joinedmembers: [creator],
						});
						await userModel.updateOne(
							{
								_id: creator,
							},
							{
								$push: {
									teams: teamdata._id,
								},
							}
						);
						res.send({
							code: 200,
							msg: 'Team created successfully',
							teamid: teamdata._id,
						});
					}
				} else {
					res.send({
						code: 500,
						msg: 'Invalid data',
					});
				}
			} catch (e) {
				res.send({
					code: 500,
					msg: 'Internal server error!!',
				});
			}
			return 0;
		});
	});

	// router.post("/creategroupandinvite", userAuthCheck, async (req, res) => {
	//     /**
	//      * Game group: Here you can add up to 4 members to be able to play in Matchmaking
	//      * or specific 5vs5 tournaments.
	//      */
	//     try {
	//         const {
	//             body: {
	//                 tokenData: { userid },
	//                 invitedmembers,
	//             },
	//         } = req;
	//         const topic = "you are invited for join a group";
	//         const type = "joingroup";
	//         const length = invitedmembers.length;
	//         if (length <= 0) {
	//             res.send({
	//                 code: 201,
	//                 msg: "Please add members and then invite them",
	//             });
	//             return;
	//         }
	//         const { group } = await userModel.findById(userid).populate({
	//             path: "group",
	//             select: { invitedmembers: 1, joinedmembers: 1 },
	//         });

	//         if (group) {
	//             const { invitedmembers: inviteds, joinedmembers } = group;
	//             const concated = [...inviteds, ...joinedmembers];
	//             const check = compareArray(concated, invitedmembers);
	//             if (check) {
	//                 res.send({
	//                     code: 201,
	//                     msg: "Some selected members are already invited",
	//                 });
	//                 return;
	//             }
	//             //Here we Invite members if the group already exist ;;;
	//             await groupModel.updateOne(
	//                 { _id: group._id },
	//                 {
	//                     $push: {
	//                         invitedmembers,
	//                     },
	//                 }
	//             );
	//             sendInvitation(userid, topic, type, io, invitedmembers);
	//             res.send({ code: 200, id: group._id });
	//         } else {
	//             //Here create group
	//             const createGroup = await groupModel.create({
	//                 invitedmembers,
	//                 joinedmembers: [userid],
	//                 creator: userid,
	//             });
	//             await userModel.updateOne({ _id: userid }, { group: createGroup._id });
	//             sendInvitation(userid, topic, type, io, invitedmembers);
	//             res.send({ code: 200, id: createGroup._id });
	//         }
	//     } catch (e) {
	//         res.send({
	//             code: 500,
	//             msg: "Internal server error!!",
	//         });
	//     }
	// });

	router.get('/searchuser/:username', userAuthCheck, async (req, res) => {
		try {
			const {
				body: {
					tokenData: { userid },
				},
				params: { username },
			} = req;
			const profileList = await userModel
				.find(
					{
						$and: [
							{
								username: {
									$regex: new RegExp('^' + username.toLowerCase(), 'i'),
								},
							},
							{
								_id: {
									$ne: userid,
								},
							},
						],
					},
					{
						username: 1,
						useravatar: 1,
						friends: 1,
					}
				)
				.lean();
			res.send({
				code: 200,
				profileList,
			});
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	// router.post("/joingroup", userAuthCheck, async (req, res) => {
	//     try {
	//         const {
	//             body: {
	//                 tokenData: { userid },
	//                 notifyid,
	//             },
	//         } = req;
	//         const { state, sender } = await notificationModel.findById(notifyid).lean();
	//         const { group: old } = await userModel.findById(userid, { group: 1 }).lean();
	//         const {
	//             group: { _id: groupid, joinedmembers, invitedmembers },
	//         } = await userModel
	//             .findById(sender, { group: 1 })
	//             .populate({
	//                 path: "group",
	//                 select: { joinedmembers: 1, invitedmembers: 1 },
	//             })
	//             .lean();
	//         const { isValid, errors } = CheckAlreadyJoined(
	//             joinedmembers,
	//             invitedmembers,
	//             userid,
	//             state,
	//             5
	//         );
	//         console.log(isValid, errors);
	//         if (!isValid) {
	//             res.send({
	//                 code: 201,
	//                 errors,
	//             });
	//             return;
	//         }
	//         await groupModel.updateOne(
	//             { _id: groupid },
	//             {
	//                 $push: { joinedmembers: userid },
	//                 $pull: { invitedmembers: objectId(userid) },
	//             }
	//         );
	//         await notificationModel.updateOne(
	//             { _id: notifyid },
	//             { state: "confirmed", seen: true }
	//         );
	//         if (old) {
	//             await RemoveFromOldGroup(old.group, userid);
	//         }
	//         await userModel.updateOne({ _id: userid }, { group: groupid });
	//         io.in(userid.toString()).emit("GetNotifications");
	//         io.in(sender.toString()).emit("GetNotifications");
	//         res.send({ code: 200, msg: "successfully joined group" });
	//     } catch (e) {
	//         res.send({
	//             code: 500,
	//             msg: "Internal server error!!",
	//         });
	//     }
	// });

	router.patch('/connectwithlink/:id', userAuthCheck, async (req, res) => {
		try {
			const {
				params: { id },
				body: {
					tokenData: { userid },
				},
			} = req;

			if (id.toString() === userid.toString()) {
				res.send({
					code: 201,
				});
				return;
			}
			const checkValidUser = await userModel.findById(id);
			if (checkValidUser) {
				await userModel.updateOne(
					{
						$and: [
							{
								_id: id,
							},
							{
								invitedfriends: {
									$ne: objectId(userid),
								},
							},
						],
					},
					{
						$push: {
							invitedfriends: userid,
						},
						$inc: {
							coins: 200,
						},
					}
				);
				await userModel.updateOne(
					{
						$and: [
							{
								_id: userid,
							},
							{
								invitedby: {
									$ne: objectId(id),
								},
							},
						],
					},
					{
						invitedby: id,
					}
				);
				res.send({
					code: 200,
				});
			} else {
				res.send({
					code: 404,
				});
			}
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.post('/inviteinteam', userAuthCheck, async (req, res) => {
		/**
		 * Game group: Here you can add up to 4 members to be able to play in Matchmaking
		 * or specific 5vs5 tournaments.
		 */
		try {
			const {
				body: {
					tokenData: { userid },
					invitedmembers,
					teamid,
					isCaptain,
				},
			} = req;
			const topic = 'you are invited for join a team';
			const type = 'jointeam';
			const length = invitedmembers.length;
			if (length <= 0) {
				res.send({
					code: 201,
					msg: 'Please add members and then invite them',
				});
				return;
			}
			const { teams } = await userModel.findById(userid).populate({
				path: 'teams',
				match: {
					_id: objectId(teamid),
				},
				select: {
					invitedmembers: 1,
					joinedmembers: 1,
				},
			});

			if (teams[0]) {
				const { invitedmembers: inviteds, joinedmembers } = teams[0];
				const concated = [...inviteds, ...joinedmembers];
				const check = compareArray(concated, invitedmembers);
				if (check) {
					res.send({
						code: 201,
						msg: 'Some selected members are already invited',
					});
					return;
				}
				//Here Invite members if group exist already
				await teamModel.updateOne(
					{
						_id: teamid,
					},
					{
						isCaptain: objectId(isCaptain),
						$push: {
							invitedmembers,
						},
					}
				);
				sendInvitation(userid, topic, type, io, invitedmembers, teamid);
				res.send({
					code: 200,
				});
			}
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.post('/jointeam', userAuthCheck, async (req, res) => {
		try {
			const {
				body: {
					tokenData: { userid },
					notifyid,
				},
			} = req;
			const { state, sender, teamid } = await notificationModel.findById(
				notifyid
			);
			const { teams } = await userModel
				.findById(sender, {
					teams: 1,
				})
				.populate({
					path: 'teams',
					match: {
						_id: teamid,
					},
					select: {
						joinedmembers: 1,
						invitedmembers: 1,
					},
				})
				.lean();
			const { joinedmembers, invitedmembers } = teams[0] ? teams[0] : {};
			const { isValid, errors } = CheckAlreadyJoined(
				joinedmembers,
				invitedmembers,
				userid,
				state,
				11
			);
			if (!isValid) {
				res.send({
					code: 201,
					errors,
				});
				return;
			}
			await teamModel.updateOne(
				{
					_id: teamid,
				},
				{
					$push: {
						joinedmembers: userid,
					},
					$pull: {
						invitedmembers: objectId(userid),
					},
				}
			);
			await notificationModel.updateOne(
				{
					_id: notifyid,
				},
				{
					state: 'confirmed',
					seen: true,
				}
			);
			await userModel.updateOne(
				{
					_id: userid,
				},
				{
					$push: {
						teams: teamid,
					},
				}
			);
			io.in(userid.toString()).emit('GetNotifications');
			io.in(sender.toString()).emit('GetNotifications');
			res.send({
				code: 200,
				msg: 'successfully joined group',
			});
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.get('/markasread', userAuthCheck, async (req, res) => {
		// This api route is used for mark as allread
		try {
			const {
				body: {
					tokenData: { userid },
				},
			} = req;
			const { notification } = await userModel
				.findById(userid, {
					notification: 1,
				})
				.populate({
					path: 'notification',
					match: {
						seen: false,
					},
					select: {
						_id: 1,
					},
				})
				.lean();
			const allarray = notification ? notification.map((el) => el._id) : [];
			await notificationModel.updateMany(
				{
					_id: {
						$in: allarray,
					},
				},
				{
					seen: true,
				}
			);
			res.send({
				code: 200,
			});
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.delete(
		'/removeuser/:id/:type/:teamid',
		userAuthCheck,
		async (req, res) => {
			try {
				const { isValid, errors, type, _id, id, userid } =
					await RemoveFromOrGroupValidate(req, res);
				if (!isValid) {
					res.send({
						code: 201,
						msg: Object.values(errors)[0],
					});
					return;
				}
				if (type === 'group') {
					await groupModel.updateOne(
						{
							_id,
						},
						{
							$pull: {
								joinedmembers: objectId(id),
							},
						}
					);
					res.send({
						code: 200,
						msg: 'Removed successfully form group',
					});
					io.in(userid.toString()).emit('GetNotifications');
				} else if (type === 'teams') {
					await teamModel.updateOne(
						{
							_id,
						},
						{
							$pull: {
								joinedmembers: objectId(id),
							},
						}
					);
					res.send({
						code: 200,
						msg: 'Removed successfully form team',
					});

					await RemoveTeam(_id, id);
				}
			} catch (error) {
				res.send({
					code: 500,
					msg: 'Internal server error!!',
				});
			}
		}
	);

	router.get('/teamdata/:teamid', checkForLoggedIn, async (req, res) => {
		try {
			const {
				params: { teamid },
				body: { userid },
			} = req;
			const teamdata = await teamModel
				.findById(teamid, {
					invitedmembers: 0,
				})
				.populate({
					path: 'joinedmembers',
					select: {
						username: 1,
						prestige: 1,
						useravatar: 1,
					},
				})
				.lean();
			res.send({
				code: 200,
				teamdata,
				islogged: userid,
			});
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.put('/leaveteam/:teamid', userAuthCheck, async (req, res) => {
		try {
			const {
				params: { teamid },
				body: {
					tokenData: { userid },
				},
			} = req;
			const checkExist = await teamModel
				.find({
					$and: [
						{
							_id: teamid,
						},
						{
							joinedmembers: {
								$in: [objectId(userid)],
							},
						},
						{
							creator: {
								$ne: objectId(userid),
							},
						},
					],
				})
				.countDocuments();
			if (checkExist >= 1) {
				await teamModel.updateOne(
					{
						_id: teamid,
					},
					{
						$pull: {
							joinedmembers: objectId(userid),
						},
					}
				);
				await RemoveTeam(teamid, userid);
				res.send({
					code: 200,
					msg: 'Successfully leaved the team',
				});
			} else {
				res.send({
					code: 201,
					msg: 'Unexpected error',
				});
			}
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.delete('/deleteteam/:teamid', userAuthCheck, async (req, res) => {
		try {
			const {
				params: { teamid },
				body: {
					tokenData: { userid },
				},
			} = req;
			const checkExist = await teamModel
				.find({
					$and: [
						{
							_id: teamid,
						},
						{
							creator: objectId(userid),
						},
					],
				})
				.lean();
			if (checkExist.length > 0) {
				const { joinedmembers } = checkExist[0];
				await teamModel.deleteOne({
					_id: teamid,
				});
				await userModel.updateMany(
					{
						_id: {
							$in: joinedmembers,
						},
					},
					{
						$pull: {
							teams: objectId(teamid),
						},
					}
				);
				res.send({
					code: 200,
					msg: 'Successfully deleted the team !!',
				});
			} else {
				res.send({
					code: 201,
					msg: 'Unexpected error',
				});
			}
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.delete('/leavegroup/:groupid', userAuthCheck, async (req, res) => {
		try {
			const {
				params: { groupid },
				body: {
					tokenData: { userid },
				},
			} = req;
			const groupData = await groupModel
				.findById(groupid, {
					members: 1,
					creator: 1,
				})
				.lean();
			if (groupData) {
				await RemoveFromOldGroup(groupid, userid, io);
				res.send({
					code: 200,
					msg: 'Successfully leaved from group !!',
				});
			} else {
				res.send({
					code: 201,
					msg: 'Internal server error!!',
				});
			}
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.patch('/inviteingroup/:playerid', userAuthCheck, async (req, res) => {
		try {
			const {
				body: {
					index,
					tokenData: { userid },
				},
				params: { playerid },
			} = req;
			const { group: groupid } = await userModel.findById(userid);
			const { username, steamid, useravatar, _id } = await userModel.findById(
				playerid,
				{
					username: 1,
					steamid: 1,
					steamavatar: 1,
					useravatar: 1,
				}
			);
			const checkAlreadyExist = await groupModel.findOne({
				$and: [
					{
						_id: groupid,
					},
					{
						'members.user._id': {
							$ne: _id,
						},
					},
				],
			});
			if (checkAlreadyExist) {
				const updateData = await groupModel.findOneAndUpdate(
					{
						_id: groupid,
						'members.index': index,
					},
					{
						$set: {
							'members.$.user': {
								username,
								useravatar,
								steamid,
								_id,
							},
							'members.$.invited': true,
						},
					},
					{
						upsert: true,
					}
				);

				const { members } = updateData;
				const oldMembers = members.filter((el) => el.user && el.joined);
				NotifYAllGroupMembers(oldMembers, io);
				CreateNotification(
					userid,
					_id,
					'Invited for join a group',
					'joingroup',
					io
				);
				res.send({
					code: 200,
					msg: `${username} invited successfully`,
				});
			} else {
				res.send({
					code: 401,
					msg: `${username} already invited in the Group`,
				});
			}
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});
	router.post('/createGroup', userAuthCheck, async (req, res) => {
		try {
			const {
				body: {
					tokenData: { userid },
				},
			} = req;
			await CreateGroup(userid);
			io.in(userid.toString()).emit('GetNotifications');
			res.send({ code: 200, msg: 'Group created successfully' });
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.post('/joingroup', userAuthCheck, async (req, res) => {
		try {
			const {
				body: {
					tokenData: { userid },
					notifyid,
				},
			} = req;
			const { sender } = await notificationModel.findById(notifyid).lean();
			//const { group: old } = await userModel.findById(userid, { group: 1 }).lean();
			const {
				group: { _id: groupid, members },
			} = await userModel
				.findById(sender, {
					group: 1,
				})
				.populate({
					path: 'group',
					select: {
						members: 1,
					},
				})
				.lean();
			const checkExist = members.filter(
				(el) =>
					el.user &&
					el.user._id.toString() === userid.toString() &&
					el.invited === true &&
					el.joined === false
			);
			if (checkExist.length > 0) {
				const { index } = checkExist[0];
				const updateData = await groupModel.findOneAndUpdate(
					{
						_id: groupid,
						'members.index': index,
					},
					{
						$set: {
							'members.$.invited': false,
							'members.$.joined': true,
							'members.$.joinedAt': new Date(),
						},
					},
					{
						new: true,
					}
				);
				await notificationModel.updateOne(
					{
						_id: notifyid,
					},
					{
						state: 'confirmed',
						seen: true,
					}
				);
				await userModel.updateOne({ _id: userid }, { group: groupid });
				const { members } = updateData;
				const oldMembers = members.filter((el) => el.user);
				NotifYAllGroupMembers(oldMembers, io);
				res.send({
					code: 200,
					msg: 'successfully joined group',
				});
			} else {
				res.send({
					code: 500,
					msg: 'unexpected error',
				});
			}
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.put(
		'/removefromgroup/:groupid/:id',
		userAuthCheck,
		async (req, res) => {
			try {
				const {
					body: {
						tokenData: { userid },
					},
					params: { groupid, id },
				} = req;
				const isGroup = await groupModel.findOne({
					$and: [{ creator: objectId(userid) }, { _id: objectId(groupid) }],
				});
				if (isGroup) {
					await userModel.updateOne({ _id: id }, { $unset: { group: '' } });
					const updateData = await groupModel.findOneAndUpdate(
						{ _id: groupid, 'members.user._id': objectId(id) },
						{
							$unset: {
								'members.$.user': '',
								'members.$.joinedAt': '',
							},
							$set: {
								'members.$.invited': false,
								'members.$.joined': false,
							},
						},
						{ new: true }
					);
					const { members } = updateData;
					const oldMembers = members.filter((el) => el.user);
					NotifYAllGroupMembers(oldMembers, io);
					res.send({ code: 200, msg: 'Player Kicked successfully' });
				} else {
					res.send({
						code: 500,
						msg: 'unexpected error',
					});
				}
			} catch (error) {
				res.send({
					code: 500,
					msg: 'Internal server error!!',
				});
			}
		}
	);

	router.get('/getrequireddata', async (req, res) => {
		try {
			const requireddata = await GetRequiredDataOnThePages();
			res.send({ code: 200, msg: 'sucsess', requireddata });
		} catch (error) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.post('/postticket', userAuthCheck, async (req, res) => {
		const form = new multiparty.Form();
		form.parse(req, async (error, fields, files) => {
			if (error) {
				res.send({
					code: 500,
					msg: 'Internal server error!!',
				});
				return;
			}
			try {
				const imageArray = files.file ? files.file : {};
				let {
					body: {
						tokenData: { userid: creator },
					},
					query,
				} = req;
				if (imageArray && imageArray.length > 0) {
					let attachment = [];
					for (let i = 0; i < imageArray.length; i++) {
						const buffer = fs.readFileSync(imageArray[i].path);
						const type = await fileType.fromBuffer(buffer);
						const timestamp = Date.now().toString();
						const fileName = `bucketFolder/${timestamp}-lg`;
						const hash = crypto
							.createHash('md5')
							.update(fileName)
							.digest('hex');
						const data = await uploadFile(buffer, hash, type, 'teamimages');
						attachment.push(data.Location);
					}
					query.attachment = attachment;
					query.sender = creator;
					let supportTicket = await TicketModel.create(query);
					await userModel.updateOne(
						{
							_id: creator,
						},
						{
							$push: {
								postedtickets: supportTicket._id,
							},
						}
					);
					res.send({
						code: 200,
						msg: 'Ticket posted successfully',
						supportTicket,
					});
				} else {
					query.sender = creator;
					let supportTicket = await TicketModel.create(query);
					await userModel.updateOne(
						{
							_id: creator,
						},
						{
							$push: {
								postedtickets: supportTicket._id,
							},
						}
					);
					res.send({
						code: 200,
						msg: 'Ticket posted successfully',
						supportTicket,
					});
				}
			} catch (e) {
				//console.log(e);
				res.send({
					code: 500,
					msg: 'Internal server error!!',
				});
			}
		});
	});

	router.get(
		'/getStatsCompare/:playerid/:type',
		userAuthCheck,
		async (req, res) => {
			try {
				const {
					body: {
						tokenData: { userid },
					},
					params: { type, playerid },
				} = req;
				const isValid = await CheckIsPremiumPlayer(userid);
				if (!isValid) {
					res.send({
						code: 201,
						msg: 'You are not able to compare your stats please upgrade your membership (premium or premium advanced)',
					});
					return;
				}
				let ptype = type === '5vs5' ? 'prestige' : 'prestige1vs1';
				const playerData = await userModel.findById(playerid, {
					username: 1,
					useravatar: 1,
					[ptype]: 1,
					ispremiumadvnaced: 1,
					ispremium: 1,
				});

				const getUserStats = await GetCalculateStatistics(playerid, type);
				res.send({
					code: 200,
					getUserStats,
					playerData,
				});
			} catch (error) {
				res.send({
					code: 500,
					msg: 'Internal server error!!',
				});
			}
		}
	);

	router.post('/joinTeamFinder', userAuthCheck, async (req, res) => {
		try {
			let {
				body: {
					tokenData: { userid },
					data,
				},
			} = req;
			const { isValid, errors } = await ValidateJoinTeamFinder(userid);
			if (!isValid) {
				res.send({
					code: 201,
					errors,
				});
				return;
			}
			let { isdisappears, description, language, roles } = data;
			let currentDate = new Date();
			let newdate = currentDate.setDate(
				currentDate.getDate() + parseInt(isdisappears)
			);
			const save = {
				isdisappears: newdate,
				description: description,
				language: language,
				roles: roles,
				joinedUser: userid,
			};
			await scoutingAreaModel.create(save);
			io.emit('refreshScoutingList');
			res.send({ code: 200, msg: 'Successfully joined team finder' });
		} catch (error) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.get('/fetchDataForScouting', async (req, res) => {
		try {
			const fetchAllCollections = await scoutingAreaModel
				.find({ isdisappears: { $gte: new Date() } })
				.populate({
					path: 'joinedUser',
					select: {
						username: 1,
						useravatar: 1,
						prestige: 1,
						prestige1vs1: 1,
						ispremium: 1,
					},
				})
				.sort({ _id: -1 })
				.lean();
			res.send({ code: 200, fetchAllCollections });
		} catch (error) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.post('/contactWithUser', userAuthCheck, async (req, res) => {
		try {
			const {
				body: {
					tokenData: { userid: sender },
					messageto: reciver,
					message,
					scoutingId,
				},
			} = req;
			let topic = `Scouting area`;
			let type = 'scouting';
			let roomId = uuidv4();
			const findMeIfIContactedBefore = await scoutingAreaModel.findOne({
				$and: [
					{ _id: scoutingId },
					{ 'incomingRequests.contactBy': objectId(sender) },
				],
			});

			if (findMeIfIContactedBefore) {
				const { incomingRequests } = findMeIfIContactedBefore;
				const { roomId: roomIDH } = incomingRequests[0];
				const storeChat = await chatModel.create({
					sendby: sender,
					message,
				});
				await scoutingAreaModel.updateOne(
					{
						$and: [{ _id: scoutingId }, { 'incomingRequests.roomId': roomIDH }],
					},
					{
						$push: {
							'incomingRequests.$.messages': storeChat._id,
						},
					}
				);
				CreateNotification(sender, reciver, topic, type, io, undefined, {
					message,
					scoutingId,
					roomId: roomIDH,
				});
				res.send({ code: 200, msg: 'Message delivered to the player' });
				// This code use for send message in the exist incoming request ---
			} else {
				const storeChat = await chatModel.create({
					sendby: sender,
					message,
				});
				const incomingRequestsObject = {
					contactBy: sender,
					contactedAt: new Date(),
					messages: [storeChat._id],
					roomId,
				};
				await scoutingAreaModel.updateOne(
					{ _id: scoutingId },
					{
						$push: {
							incomingRequests: incomingRequestsObject,
						},
					}
				);
				CreateNotification(sender, reciver, topic, type, io, undefined, {
					message,
					scoutingId,
					roomId,
				});
				res.send({ code: 200, msg: 'Message delivered to the player' });
			}
		} catch (error) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.post('/getfilterdata', async (req, res) => {
		try {
			const { body } = req;
			const getobject = CreateFilterObject(body);
			let { minrank, maxrank, prestigemax } = body;
			let result = await scoutingAreaModel
				.find(getobject)
				.populate({
					path: 'joinedUser',
					select: {
						username: 1,
						useravatar: 1,
						prestige: 1,
						prestige1vs1: 1,
					},
				})
				.lean();
			if (minrank && maxrank) {
				let fetchAllCollections = result.filter(
					(el) =>
						el.joinedUser.prestige >= minrank &&
						el.joinedUser.prestige <= maxrank
				);
				res.send({ code: 200, fetchAllCollections });
			} else if (minrank != null) {
				let fetchAllCollections = result.filter(
					(el) =>
						el.joinedUser.prestige >= minrank &&
						el.joinedUser.prestige <= prestigemax
				);
				res.send({ code: 200, fetchAllCollections });
			} else {
				let fetchAllCollections = result;
				res.send({ code: 200, fetchAllCollections });
			}
		} catch (error) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});
	router.get(
		'/GetScoutingAreaNotifyMsg/:scoutingId/:roomId',
		userAuthCheck,
		async (req, res) => {
			try {
				const {
					params: { scoutingId, roomId },
				} = req;
				const getDataForChat = await scoutingAreaModel
					.findOne(
						{
							$and: [
								{ _id: scoutingId },
								{ 'incomingRequests.roomId': roomId },
							],
						},
						{
							incomingRequests: {
								messages: 1,
								roomId: 1,
							},
						}
					)
					.populate({
						path: 'incomingRequests.messages',
						populate: {
							path: 'sendby',
							select: { useravatar: 1, username: 1 },
							options: { sort: { _id: -1 } },
						},
					})
					.lean();
				if (!getDataForChat) {
					res.send({
						code: 404,
						msg: 'No data found !!',
					});
					return;
				}
				let { incomingRequests } = getDataForChat;
				console.log('incomingRequests', incomingRequests);
				incomingRequests = incomingRequests.filter(
					(el) => el.roomId === roomId
				);
				res.send({ code: 200, getDataForChat: incomingRequests });
			} catch (error) {
				res.send({
					code: 500,
					msg: 'Internal server error!!',
				});
			}
		}
	);

	router.post('/thumbsUp', userAuthCheck, async (req, res) => {
		try {
			const {
				body: {
					tokenData: { userid },
					thumbsto,
					roomid,
				},
			} = req;
			const { isValid, errors, roomType } = await validateThumb(roomid, userid);
			if (!isValid) {
				res.send({ code: 201, errors });
				return;
			}
			await userModel.updateOne(
				{ _id: thumbsto },
				{
					$inc: {
						points: 1,
					},
				}
			);
			if (roomType === 'room') {
				console.log('in room');
				await roomModel.updateOne(
					{ _id: roomid },
					{
						$push: {
							thumbs: userid,
						},
					}
				);
			} else if (roomType === 'hubroom') {
				console.log('in hub');
				await hubsModel.updateOne(
					{ _id: roomid },
					{
						$push: {
							thumbs: userid,
						},
					}
				);
			}
			res.send({ code: 200, msg: 'Voted successfully !!' });
		} catch (error) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.post('/thumbsDownAndReportIssue', userAuthCheck, async (req, res) => {
		try {
			const {
				body: {
					tokenData: { userid: reportedBy },
					category,
					description,
					reportedTo,
					roomid,
				},
			} = req;
			const { isValid, errors, roomType } = await validateReport(
				roomid,
				reportedBy,
				reportedTo
			);

			if (!isValid) {
				res.send({ code: 201, errors });
				return;
			}
			console.log('data =>>', reportedBy, reportedTo);
			const createReports = await gameReportModel.create({
				reportedBy,
				reportedTo,
				category,
				description,
			});
			if (roomType === 'room') {
				console.log('in room');
				await roomModel.updateOne(
					{ _id: roomid },
					{
						$push: {
							reports: createReports._id,
						},
					}
				);
			} else if (roomType === 'hubroom') {
				console.log('in hub');
				await hubsModel.updateOne(
					{ _id: roomid },
					{
						$push: {
							reports: createReports._id,
						},
					}
				);
			}
			res.send({ code: 200, msg: 'Successfully reported this player !!' });
		} catch (error) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.get(
		'/checkAlreadyReported/:reportedTo/:roomid',
		userAuthCheck,
		async (req, res) => {
			try {
				const {
					params: { reportedTo, roomid },
					body: {
						tokenData: { userid: reportedBy },
					},
				} = req;

				const { isValid, errors } = await validateReport(
					roomid,
					reportedBy,
					reportedTo
				);
				if (!isValid) {
					res.send({ code: 201, errors });
					return;
				}
				res.send({ code: 200 });
			} catch (error) {
				res.send({
					code: 500,
					msg: 'Internal server error!!',
				});
			}
		}
	);

	/** Here is the payment section user can deposit money on the platform  */

	router.post('/deposit', userAuthCheck, async (req, res) => {
		const {
			body: {
				amount,
				tokenData: { userid },
			},
		} = req;
		const create_payment_json = {
			intent: 'sale',
			payer: {
				payment_method: 'paypal',
			},
			redirect_urls: {
				return_url: `${server}/api/user-route-handler/success`,
				cancel_url: `${server}/api/user-route-handler/cancel`,
			},
			transactions: [
				{
					item_list: {
						items: [
							{
								name: 'Red Sox Hat',
								sku: '001',
								price: amount,
								currency: 'EUR',
								quantity: 1,
							},
						],
					},
					amount: {
						currency: 'EUR',
						total: amount,
					},
					description: 'Hat for the best team ever',
					custom: JSON.stringify({
						userid,
						total: amount,
					}),
				},
			],
		};
		paypal.payment.create(create_payment_json, (error, payment) => {
			try {
				console.log(error, payment);
				for (let i = 0; i < payment.links.length; i++) {
					if (payment.links[i].rel === 'approval_url') {
						//res.redirect(payment.links[i].href);
						res.send({
							code: 200,
							url: payment.links[i].href,
						});
					}
				}
			} catch (e) {
				res.send({
					code: 500,
					msg: 'Internal server error !!',
				});
			}
		});
	});

	router.get('/success', (req, res) => {
		const {
			query: { PayerID, paymentId },
		} = req;
		paypal.payment.get(paymentId, (error, payment) => {
			try {
				console.log('Payment', error, payment);
				const {
					amount: { total },
				} = payment.transactions[0];
				const execute_payment_json = {
					payer_id: PayerID,
					transactions: [
						{
							amount: {
								currency: 'EUR',
								total,
							},
						},
					],
				};
				paypal.payment.execute(
					paymentId,
					execute_payment_json,
					async (error, payment) => {
						try {
							console.log('payment =>>>', payment);
							let { custom } = payment.transactions[0];
							console.log(custom);
							const { total: totalamount, userid } = JSON.parse(custom);
							const TransactionData = {
								userid: userid,
								transaction_data: payment,
								total: totalamount,
								transaction_type: 'deposit',
							};
							console.log('Transcation data', TransactionData);
							const saved = await transactionModel.create(TransactionData);
							await userModel.updateOne(
								{ _id: userid },
								{
									$inc: {
										onsiteWallet: parseInt(totalamount),
									},
									$push: {
										transaction: saved._id,
									},
								}
							);
							res.redirect(`${client}`);
						} catch (e) {
							console.log('First =>> ', e);
							res.redirect(`${client}/?status=failed`);
						}
					}
				);
			} catch (e) {
				console.log('seconds =>> ', e);
				res.redirect(`${client}/?status=failed`);
			}
		});
	});

	router.get('/cancel', async (req, res) => res.send('Cancelled'));

	//Create withdraw request -

	router.post('/createWithdrawRequest', userAuthCheck, async (req, res) => {
		try {
			const { body } = req;
			const { isValid, errors } = await ValidateWithdrawRequest(body);
			if (!isValid) {
				res.send({ code: 200, errors });
				return;
			}
			//This code for apply transaction fees
			let {
				amount,
				data,
				tokenData: { userid },
			} = body;
			const feeAmount = (amount * 2) / 100;
			const exactAmount = amount - feeAmount;
			data.amount = exactAmount;
			data.requestedBy = userid;
			const createWithdraw = await withdrawModel.create(data);
			console.log('createReest =>>', createWithdraw);
			await userModel.updateOne(
				{ _id: userid },
				{
					$push: {
						withdrawRequests: createWithdraw._id,
					},
					$inc: {
						onsiteWallet: -amount,
					},
				}
			);
			res.send({
				code: 200,
				msg: 'Your request will be reviewed and approved by an administrator, thank you',
			});
		} catch (error) {
			console.log(error);
			res.send({
				code: 500,
				msg: 'Internal server error !!',
			});
		}
	});

	router.post('/addPaypalAccount', userAuthCheck, async (req, res) => {
		try {
			const {
				body: {
					tokenData: { userid },
					paypalAccount,
					nickname,
					dob,
					mainteam,
					nationality,
				},
			} = req;
			console.log(nickname, dob, mainteam, nationality);
			await userModel.updateOne(
				{ _id: userid },
				{ paypalAccount, nickname, dob, mainteam, nationality }
			);
			res.send({ code: 200, msg: 'Added successfully !' });
		} catch (error) {
			console.log(error);
			res.send({
				code: 500,
				msg: 'Internal server error !!',
			});
		}
	});

	//Test user data

	router.post('/checkdoban', async (req, res) => {
		try {
			const intercall = await interFunction3(
				'',
				'',
				'',
				'',
				'602d13c57b5e611509e221af'
			);
		} catch (error) {
			return error;
		}
	});
	router.post('/addsubScription', userAuthCheck, async (req, res) => {
		try {
			//Here we setuped the recurring payment method for the use
			await Create_Paypal_Recurring_Agreement(req, res);
		} catch (error) {
			console.log(error);
			res.send({
				code: 500,
				msg: 'Internal server error !!',
			});
		}
	});
	router.get('/subscriptionsuccess', async (req, res) => {
		try {
			//Here we are calling payment success function
			await PaymentSuccess(req, res);
		} catch (error) {
			console.log(error);
			res.send({
				code: 500,
				msg: 'Internal server error !!',
			});
		}
	});

	router.get('/getWebhookNotifications', async (req, res) => {
		try {
			console.log('okk');
			console.log('REQ=>', req);
			console.log('RES=>', res);
			// res.send({ code: 200, res});
		} catch (error) {
			console.log(error);
			res.send({
				code: 500,
				msg: 'Internal server error !!',
			});
		}
	});

	/********** Store Product ***************/
	router.get('/showproduct', async (req, res) => {
		try {
			let allproducts = await productModel
				.find({ isredeem: false })
				.populate({
					path: 'createdby',
					select: {
						username: 1,
						useravatar: 1,
					},
				})
				.populate({
					path: 'catid',
					select: { name: 1 },
				})
				.populate({
					path: 'comments',
					select: { _id: 0, comment: 1, commentby: 1, date: 1 },
					populate: {
						path: 'commnetedby',
						select: {
							_id: 0,
							username: 1,
							useravatar: 1,
						},
					},
				})
				.sort({ _id: -1 })
				.lean();
			res.send({
				code: 200,
				allproducts,
			});
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error',
			});
		}
	});
	router.put('/productlike/:_id', userAuthCheck, async (req, res) => {
		try {
			const {
				params: { _id },
				tokenData: { userid },
			} = req;

			let id = mongoose.Types.ObjectId(userid);
			let updateBy = {};
			const FindLike = await productModel.findOne({
				$and: [{ _id }, { likes: userid }],
			});
			if (FindLike) {
				updateBy = {
					$pull: {
						likes: id,
					},
				};
			} else {
				updateBy = {
					$push: {
						likes: id,
					},
				};
			}
			await productModel.updateOne({ _id }, updateBy);
			res.send({
				code: 200,
			});
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});
	router.get('/categoryslist', async (req, res) => {
		try {
			const allcategorys = await categoryModel.find().sort({ _id: -1 }).lean();
			res.send({ code: 200, allcategorys });
		} catch (error) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});
	router.put('/wishlist/:_id', userAuthCheck, async (req, res) => {
		try {
			const {
				params: { _id },
				tokenData: { userid },
			} = req;

			let id = mongoose.Types.ObjectId(userid);
			let updateBy = {};
			const FindWishlist = await productModel.findOne({
				$and: [{ _id }, { wishlist: userid }],
			});
			if (FindWishlist) {
				updateBy = {
					$pull: {
						wishlist: id,
					},
				};
			} else {
				updateBy = {
					$push: {
						wishlist: id,
					},
				};
			}
			await productModel.updateOne({ _id }, updateBy);
			res.send({
				code: 200,
			});
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});
	router.patch('/productComment/:pid', userAuthCheck, async (req, res) => {
		try {
			const {
				body: { comment },
				tokenData: { userid: commnetedby },
				params: { pid },
			} = req;
			const createComment = await commentModel.create({ comment, commnetedby });
			await productModel.updateOne(
				{ _id: pid },
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
						{ _id: 0, comment: 1, date: 1, commnetedby: 1 }
					)
					.populate({
						path: 'commnetedby',
						select: {
							_id: 0,
							username: 1,
							useravatar: 1,
						},
					});
				res.send({ code: 200, msg: 'Success', getCommentData });
			}
		} catch (e) {
			res.send({ code: 500, msg: 'Internal server Error' });
		}
	});
	router.post('/readmeProduct', userAuthCheck, async (req, res) => {
		try {
			const {
				body: {
					tokenData: { userid },
					pid,
					phone,
					steamcode,
					town,
					country,
					province,
					direction,
					totalcoins,
					price,
					type,
					admin,
				},
			} = req;
			const saved = await pruchesitemModel.create({
				pid: pid,
				purchaseby: userid,
				phone: phone,
				town: town,
				country: country,
				province: province,
				direction: direction,
			});
			if (type === 'realmoney') {
				await userModel.updateOne(
					{ _id: userid },
					{
						$inc: { onsiteWallet: -price },
						$push: {
							pruches_item: saved._id,
						},
					}
				);
			} else {
				await userModel.updateOne(
					{ _id: userid },
					{
						$inc: { coins: -totalcoins },
						$push: {
							pruches_item: saved._id,
						},
					}
				);
			}

			await productModel.updateOne(
				{ _id: pid },
				{
					isredeem: true,
					$inc: { quantity: -1 },
				}
			);
			let topic = 'Your Redeems Steam Code is (' + steamcode + ' )';
			io.in(userid.toString()).emit('GetNotifications');
			CreateNotification(userid, userid, topic, 'steamcard', io);

			let adminmsg =
				'that (' +
				steamcode +
				' ) code can no longer be redeemed since it is used!';
			io.in(admin.toString()).emit('GetNotifications');
			CreateNotification(admin, admin, topic, 'steamcard', io);
			res.send({
				code: 200,
				msg: 'Card Successfully Redeems ',
				purchaseId: saved._id,
			});
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server Error',
			});
		}
	});

	/********** store end **************/
	router.get('/subscriptioncancel', (req, res) => {
		const { body } = req;
		res.send({ code: 201, msg: 'Cancelled !!', body });
	});

	/** Post model */

	router.post(
		'/addpostv2',
		userAuthCheck,

		async (req, res) => {
			const form = new multiparty.Form();
			form.parse(req, async (error, fields, files) => {
				if (error) {
					res.send({
						code: 500,
						msg: 'Internal server error!!',
					});
					return;
				}
				try {
					let fileArray = [];
					const imageArray = files.file ? files.file : [];
					const {
						body: {
							tokenData: { userid },
						},
					} = req;
					let { content } = req.query;
					if (imageArray.length) {
						for (let i = 0; i < imageArray.length; i++) {
							const buffer = fs.readFileSync(imageArray[i].path);
							const type = await fileType.fromBuffer(buffer);
							const timestamp = Date.now().toString();
							const fileName = `bucketFolder/${timestamp}-lg`;
							const hash = crypto
								.createHash('md5')
								.update(fileName)
								.digest('hex');
							const data = await uploadFile(buffer, hash, type, 'postimages');
							fileArray.push(data.Location);
						}
					}
					const createPost = await postModel.create({
						content,
						images: fileArray,
						postedby: userid,
					});
					await userModel.updateOne(
						{ _id: userid },
						{
							$push: {
								posts: createPost._id,
							},
						}
					);
					res.send({ code: 200, msg: 'Post add successfully', createPost });
				} catch (error) {
					console.log(error);
					res.send({ code: 500, msg: 'Internal server Error' });
				}
			});
		}
	);
	router.get('/allpost', userAuthCheck, async (req, res) => {
		try {
			const skip = req.query.skip ? parseInt(req.query.skip) : 1;
			const limit = req.query.limit ? parseInt(req.query.limit) : 5;
			let posts = await postModel
				.find()
				.populate({
					path: 'postedby',
					select: { username: 1, useravatar: 1 },
				})
				.populate({
					path: 'comments',
					select: { _id: 0, comment: 1, createdAt: 1, commnetedby: 1 },
					populate: {
						path: 'commentby',
						select: {
							_id: 1,
							username: 1,
							useravatar: 1,
						},
					},
				}).populate({
					path:'likes',
					select: {
						_id: 1,
						username: 1,
						useravatar: 1,
					},
				})
				.skip(skip)
				.limit(limit)
				.sort({ _id: -1 })
				.lean();
			const postCounts = await postModel.countDocuments({});
			res.send({ code: 200, posts, postCounts });
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error',
			});
		}
	});
	router.put('/addpostReact', userAuthCheck, async (req, res) => {
		try {
			/**
			 * This api route is used to like/deslike on the posts
			 */
			const {
				body: {
					playload: { type, postid },
					tokenData: { userid },
				},
			} = req;
			let id = mongoose.Types.ObjectId(userid);
			let updateBy = {};
			const FindLike = await postModel.findOne({
				$and: [{ _id: postid }, { [type]: userid }],
			});
			if (FindLike) {
				updateBy = {
					$pull: {
						[type]: id,
					},
				};
			} else {
				updateBy = {
					$push: {
						[type]: id,
					},
				};
			}
			await postModel.updateOne({ _id: postid }, updateBy);
			res.send({
				code: 200,
			});
		} catch (e) {
			console.log(e);
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.get('/FetchPlayerData/:id', checkForLoggedIn, async (req, res) => {
		try {
			const {
				// body: { userid },
				params: { id },
			} = req;
			const userdata = await userModel
				.findById(id, {
					username: 1,
					useravatar: 1,
					friends: 1,
					ispremium: 1,
					ispremiumadvnaced: 1,
					prestige: 1,
					prestige1vs1: 1,
					joined_at: 1,
					following: 1,
					followers: 1,
					followingCount: 1,
					followersCount: 1,
					signatureBook: 1,
					posts: 1,
					nickname: 1,
					dob: 1,
					mainteam: 1,
					nationality: 1,
				})
				.populate({
					path: 'teams',
					select: {
						name: 1,
						teamlogo: 1,
						creator: 1,
					},
					options: {
						sort: {
							_id: -1,
						},
					},
				})
				.populate({
					path: 'friends',
					select: {
						bothfriends: 1,
						_id: 0,
					},
					options: {
						sort: {
							_id: -1,
						},
					},
					populate: {
						path: 'bothfriends',
						select: {
							username: 1,
							useravatar: 1,
							online: 1,
							group: 1,
							profileurl: 1,
						},
						match: {
							_id: {
								$ne: objectId(id),
							},
						},
					},
				})
				.populate({
					path: 'posts',
					populate: {
						path: 'postedby',
						select: { username: 1, useravatar: 1 },
						populate: {
							path: 'comments',
							select: { _id: 0, comment: 1, createdAt: 1, commnetedby: 1 },
							populate: {
								path: 'commentby',
								select: {
									_id: 1,
									username: 1,
									useravatar: 1,
								},
							},
						},
					},
					options: {
						sort: { _id: -1 },
					},
				})
				.populate({
					path: 'posts',
					populate: {
						path: 'comments',
						select: { _id: 0, comment: 1, createdAt: 1, commnetedby: 1 },
						populate: {
							path: 'commentby',
							select: {
								_id: 1,
								username: 1,
								useravatar: 1,
							},
						},
					},
				})
				.populate({
					path: 'signatureBook.userid',
					select: {
						username: 1,
						useravatar: 1,
					},
				})
				.lean();
			const JoinedTournaments = await tournamentModel
				.find(
					{ $and: [{ 'playerJoined.UserOrTeam': objectId(id) }] },
					{
						title: 1,
						playerNumbers: 1,
						gameType: 1,
						tournamentType: 1,
						tournamentStart: 1,
						banner: 1,
						tournamentPrize: 1,
						createdBy: 1,
						playerJoined: 1,
						tournamentStarted: 1,
						tournamentEnd: 1,
					}
				)
				.lean();
			const lastMatches = await LastMatchesData(id);
			const getUserStats1vs1 = await GetCalculateStatistics(id, '1vs1');
			const getUserStats5vs5 = await GetCalculateStatistics(id, '5vs5');
			res.send({
				code: 200,
				userdata,
				JoinedTournaments,
				lastMatches,
				getUserStats1vs1,
				getUserStats5vs5,
			});
		} catch (e) {
			res.send({
				code: 500,
				msg: 'Internal server error',
			});
		}
	});

	router.put('/follow/:_id', userAuthCheck, async (req, res) => {
		try {
			/**
			 * This api route is used to follow and unfollow
			 */
			const { _id } = req.params;
			const {
				body: {
					tokenData: { userid },
				},
			} = req;
			let id = mongoose.Types.ObjectId(userid);
			let toid = mongoose.Types.ObjectId(_id);
			let updateBy = {};
			let updateTo = {};

			if (_id.toString() === userid.toString()) {
				res.send({ code: 201 });
				return;
			}
			const FindLike = await userModel.findOne({
				$and: [{ _id }, { followers: userid }],
			});
			if (FindLike) {
				updateBy = {
					$pull: {
						followers: id,
					},
					$inc: {
						followersCount: -1,
					},
				};
				updateTo = {
					$pull: {
						following: toid,
					},
					$inc: {
						followingCount: -1,
					},
				};
			} else {
				updateBy = {
					$push: {
						followers: id,
					},
					$inc: {
						followersCount: 1,
					},
				};
				updateTo = {
					$push: {
						following: toid,
					},
					$inc: {
						followingCount: 1,
					},
				};
			}
			await userModel.updateOne({ _id }, updateBy);
			await userModel.updateOne({ _id: id }, updateTo);
			res.send({
				code: 200,
				msg: 'Success !',
			});
		} catch (e) {
			console.log(e);
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	router.post('/signatureBook', userAuthCheck, async (req, res) => {
		try {
			const {
				body: {
					tokenData: { userid },
					id,
					message,
				},
			} = req;
			const CheckAlreadySignarured = await userModel
				.find({ $and: [{ 'signatureBook.userid': objectId(userid) }] })
				.lean();
			if (CheckAlreadySignarured.length > 0) {
				return res.send({
					code: 201,
					msg: 'You already signature on this book',
				});
			}
			const signatureObject = { userid, message, signatureAt: new Date() };
			await userModel.updateOne(
				{ _id: id },
				{
					$push: {
						signatureBook: signatureObject,
					},
				}
			);
			res.send({
				code: 200,
				msg: 'Successfully signatured on the book !',
			});
		} catch (error) {
			res.send({
				code: 500,
				msg: 'Internal server error!!',
			});
		}
	});

	return router;
};
export default UserRoute;
