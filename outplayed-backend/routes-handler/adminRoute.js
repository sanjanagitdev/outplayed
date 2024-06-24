import express from "express";
import {
    hashPassword,
    verifyPassword,
    signJwtAdmin,
    uploadFile,
    checkIfEmpty,
} from "../functions/index";
import { adminAuthCheck, userAuthCheck } from "../middleware/checkAuth";
import adminModel from "../models/admin";
import multiparty from "multiparty";
import fs from "fs";
import fileType from "file-type";
import crypto from "crypto";
import paypal from "paypal-rest-sdk";
import newsModel from "../models/news";
import mapImageModel from "../models/map";
import hubsModel from "../models/hubs";
import serverModel from "../models/server";
import tournamentRulesModel from "../models/tournament-rules";
import TicketModel from "../models/ticket";
import gameReportModel from "../models/gamereports";
import withdrawModel from "../models/withdrawls";
import userModel from "../models/user";
import productModel from "../models/product";
import categoryModel from "../models/categorys";
import pruchesitemModel from "../models/pruchesitem";
import tournamentModel from "../models/tournament";

paypal.configure({
    mode: process.env.PAYPAL_MODE, //sandbox or live
    client_id: process.env.PAY_PAL_CLIENT_ID,
    client_secret: process.env.PAY_PAL_CLIENT_SECRET,
});

const router = new express.Router();
const AdminRoute = (io) => {
    /**
     * This is the user admin route handler all the admin specific
     * apis are performed from here
     */
    router.post("/login", async (req, res) => {
        try {
            /**
             * This api is used for login the admin on the platform
             */
            const { username, password } = req.body;
            const loginUser = await adminModel.findOne({ username });
            if (loginUser) {
                const cmp = await verifyPassword(password, loginUser.password);
                if (cmp) {
                    const token = signJwtAdmin(loginUser._id);
                    res.send({
                        code: 200,
                        msg: "Authenticated successfully",
                        token: token,
                    });
                } else {
                    res.send({
                        code: 204,
                        msg: "Incorrect password",
                    });
                }
            } else {
                res.send({
                    code: 404,
                    msg: "user Not found",
                });
            }
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });
    //   router.post("/signupadmin", async (req, res) => {
    //     try {
    //       let password = await hashPassword("TRY342Tgdf*&Q$$44");
    //       let payload = {
    //         username: "autoplayedplatform",
    //         password,
    //       };
    //       let saveAdmin = new adminModel(payload);
    //       await saveAdmin.save();
    //       res.send({
    //         code: 200,
    //         msg: "success",
    //       });
    //     } catch (e) {
    //       res.send({
    //         code: 500,
    //         msg: "Some Error Has Occured",
    //       });
    //     }
    //   });
    // This is the api for add news from admin panel
    // API for upload picture
    router.post("/addnews", adminAuthCheck, async (req, res) => {
        const form = new multiparty.Form();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log(error);
            }
            try {
                const { isValid } = checkIfEmpty(req.query);
                if (isValid) {
                    const { path } = files.file[0];
                    const buffer = fs.readFileSync(path);
                    const type = await fileType.fromBuffer(buffer);
                    const timestamp = Date.now().toString();
                    const fileName = `bucketFolder/${timestamp}-lg`;
                    const hash = crypto.createHash("md5").update(fileName).digest("hex");
                    const data = await uploadFile(buffer, hash, type, "news");
                    req.query.imgurl = data.Location;
                    const newsData = new newsModel(req.query);
                    await newsData.save();
                    res.send({
                        code: 200,
                        msg: "News added successfully",
                    });
                } else {
                    res.send({
                        code: 500,
                        msg: "Invalid data",
                    });
                }
            } catch (e) {
                res.send({
                    code: 500,
                    msg: "Internal server error!!",
                });
            }
            return 0;
        });
    });

    router.get("/getnews", adminAuthCheck, async (req, res) => {
        try {
            const allnews = await newsModel.find().sort({ createdAt: -1 }).lean();
            res.send({
                code: 200,
                allnews,
            });
        } catch (e) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.delete("/deletenews/:_id", adminAuthCheck, async (req, res) => {
        try {
            const { _id } = req.params;
            await newsModel.deleteOne({ _id });
            res.send({ code: 200, msg: "success" });
        } catch (e) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.patch("/updatenews/:_id", adminAuthCheck, async (req, res) => {
        const form = new multiparty.Form();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log(error);
            }
            try {
                const { isValid } = checkIfEmpty(req.query);
                if (isValid) {
                    const { path } = files.file ? files.file[0] : {};
                    const { _id } = req.params;
                    const { title, content, category } = req.query;
                    if (path) {
                        const buffer = fs.readFileSync(path);
                        const type = await fileType.fromBuffer(buffer);
                        const timestamp = Date.now().toString();
                        const fileName = `bucketFolder/${timestamp}-lg`;
                        const hash = crypto.createHash("md5").update(fileName).digest("hex");
                        const data = await uploadFile(buffer, hash, type, "news");
                        await newsModel.updateOne(
                            { _id },
                            { title, content, category, imgurl: data.Location }
                        );
                        res.send({ code: 200, msg: "News updated successfully" });
                    } else {
                        await newsModel.updateOne({ _id }, { title, content, category });
                        res.send({ code: 200, msg: "News updated successfully" });
                    }
                } else {
                    res.send({
                        code: 500,
                        msg: "Invalid data",
                    });
                }
            } catch (e) {
                res.send({
                    code: 500,
                    msg: "Internal server error!!",
                });
            }
            return 0;
        });
    });
    router.get("/getnewsdata/:_id", adminAuthCheck, async (req, res) => {
        try {
            const { _id } = req.params;
            const data = await newsModel.findById(_id).lean();
            if (data) {
                res.send({
                    code: 200,
                    data,
                });
            } else {
                res.send({
                    code: 404,
                });
            }
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.post("/addmapimage", adminAuthCheck, async (req, res) => {
        const form = new multiparty.Form();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log(error);
            }
            try {
                const { isValid } = checkIfEmpty(req.query);
                console.log("checkIfEmpty(req.query)==>", checkIfEmpty(req.query), req.query);
                console.log(isValid);
                if (isValid) {
                    const { path } = files.file[0];
                    const buffer = fs.readFileSync(path);
                    const type = await fileType.fromBuffer(buffer);
                    const timestamp = Date.now().toString();
                    const fileName = `bucketFolder/${timestamp}-lg`;
                    const hash = crypto.createHash("md5").update(fileName).digest("hex");
                    const data = await uploadFile(buffer, hash, type, "map");
                    req.query.imgurl = data.Location;
                    await mapImageModel.create(req.query);
                    res.send({
                        code: 200,
                        msg: "Map added successfully",
                    });
                } else {
                    res.send({
                        code: 500,
                        msg: "Invalid data",
                    });
                }
            } catch (e) {
                res.send({
                    code: 444,
                    msg: "Some error has occured!",
                });
            }
            return 0;
        });
    });

    router.patch("/updatemap/:_id", adminAuthCheck, async (req, res) => {
        const form = new multiparty.Form();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log(error);
            }
            try {
                const { isValid } = checkIfEmpty(req.query);
                if (isValid) {
                    const { path } = files.file ? files.file[0] : {};
                    const { _id } = req.params;
                    if (path) {
                        const buffer = fs.readFileSync(path);
                        const type = await fileType.fromBuffer(buffer);
                        const timestamp = Date.now().toString();
                        const fileName = `bucketFolder/${timestamp}-lg`;
                        const hash = crypto.createHash("md5").update(fileName).digest("hex");
                        const data = await uploadFile(buffer, hash, type, "news");
                        req.query.imgurl = data.Location;
                        await newsModel.updateOne({ _id }, req.query);
                        res.send({ code: 200, msg: "Map updated successfully" });
                    } else {
                        await mapImageModel.update({ _id }, req.query);
                        res.send({ code: 200, msg: "Map updated successfully" });
                    }
                } else {
                    res.send({
                        code: 500,
                        msg: "Invalid data",
                    });
                }
            } catch (e) {
                res.send({
                    code: 500,
                    msg: "Internal server error!!",
                });
            }
            return 0;
        });
    });

    router.get("/mapdata/:id", adminAuthCheck, async (req, res) => {
        try {
            const {
                params: { id },
            } = req;
            const mapdata = await mapImageModel.findById(id).lean();
            if (mapdata) {
                res.send({ code: 200, mapdata });
            } else {
                res.send({ code: 201 });
            }
        } catch (error) {
            res.send({
                code: 500,
                msg: "Some error has occured!",
            });
        }
    });

    router.delete("/deletemap/:id", adminAuthCheck, async (req, res) => {
        try {
            const {
                params: { id },
            } = req;
            await mapImageModel.deleteOne({ _id: id });
            res.send({ code: 200, msg: "Message deleted successfully" });
        } catch (e) {
            res.send({
                code: 500,
                msg: "Some error has occured!",
            });
        }
    });

    router.get("/allmaps", adminAuthCheck, async (req, res) => {
        try {
            const maps = await mapImageModel.find({}).sort({ _id: -1 }).lean();
            res.send({ code: 200, maps });
        } catch (error) {
            res.send({
                code: 500,
                msg: "Some error has occured!",
            });
        }
    });
    // router.post("/addmapimage", adminAuthCheck, async (req, res) => {
    //     try {
    //         delete req.body.tokenData;
    //         console.log(req.body);
    //         const { isValid } = checkIfEmpty(req.body);
    //         if (isValid) {
    //             await mapImageModel.create(req.body);
    //             res.send({
    //                 code: 200,
    //                 msg: "Map added successfully",
    //             });
    //         } else {
    //             res.send({
    //                 code: 500,
    //                 msg: "Invalid data",
    //             });
    //         }
    //     } catch (e) {
    //         console.log(e);
    //         res.send({
    //             code: 444,
    //             msg: "Some error has occured!",
    //         });
    //     }
    //     return 0;
    // });

    router.get("/checkauth", adminAuthCheck, async (req, res) => {
        try {
            res.send({ code: 200 });
        } catch (e) {
            res.send({
                code: 500,
                msg: "Error in admin auth check",
            });
        }
    });

    router.post("/createnormalhub", adminAuthCheck, async (req, res) => {
        try {
            const { name, prestige } = req.body;
            const { isValid } = checkIfEmpty({ name, prestige });
            if (isValid) {
                const CreateNormalHub = await hubsModel.create({
                    name,
                    prestige,
                    byadmin: true,
                });
                if (CreateNormalHub) {
                    res.send({ code: 200, msg: "Successfully created normal hubs" });
                    io.emit("GetCreatedHubs", CreateNormalHub);
                } else {
                    res.send({
                        code: 401,
                        msg: "Unexpected error !!",
                    });
                }
            } else {
                res.send({
                    code: 201,
                    msg: "Invalid request body",
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

    router.get("/normalhubslist", adminAuthCheck, async (req, res) => {
        try {
            const allnormalhubs = await hubsModel
                .find({ byadmin: true }, { running: 1, name: 1, prestige: 1 })
                .sort({ _id: -1 })
                .lean();
            res.send({ code: 200, allnormalhubs });
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.get("/normalhubbyid/:hubid", adminAuthCheck, async (req, res) => {
        try {
            const { hubid } = req.params;
            const data = await hubsModel
                .findOne(
                    { $and: [{ _id: hubid }, { byadmin: true }] },
                    { running: 1, name: 1, prestige: 1 }
                )
                .lean();
            res.send({ code: 200, data });
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.patch("/updatenormalhub", adminAuthCheck, async (req, res) => {
        try {
            const {
                body: { name, prestige, hubid },
            } = req;
            const { isValid } = checkIfEmpty({ name, prestige });
            if (isValid) {
                await hubsModel.updateOne(
                    { $and: [{ _id: hubid }, { byadmin: true }] },
                    { name, prestige }
                );
                res.send({ code: 200, msg: "Updated successfully" });
            } else {
                res.send({
                    code: 201,
                    msg: "Invalid request body",
                });
            }
        } catch (e) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.delete("/deletehubyid/:hubid", adminAuthCheck, async (req, res) => {
        try {
            const { hubid } = req.params;
            const { joinedplayers, team1, team2 } = await hubsModel.findById(hubid);
            const checkSomeExist = [...joinedplayers, ...team1, ...team2];
            if (checkSomeExist.length <= 0) {
                await hubsModel.deleteOne({
                    $and: [{ _id: hubid }, { byadmin: true }],
                });
                res.send({ code: 200, msg: "Successfully deleted ormal hub" });
            } else {
                res.send({
                    code: 201,
                    msg: "Some player's are exist in this hub, so can't able to delete this hub",
                });
            }
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.post("/addserver", adminAuthCheck, async (req, res) => {
        try {
            const { body } = req;
            const savedData = await serverModel.create(body);
            res.send({
                code: 200,
                msg: "success",
                serverid: savedData._id,
            });
        } catch (e) {
            console.log(e);
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.get("/serverlist", adminAuthCheck, async (req, res) => {
        try {
            const serverlist = await serverModel
                .find(
                    {},
                    {
                        ip: 1,
                        port: 1,
                        status: 1,
                        sshuser: 1,
                        sshpassword: 1,
                        rconpassword: 1,
                        servertype: 1,
                    }
                )
                .sort({ _id: -1 })
                .lean();
            res.send({
                code: 200,
                serverlist,
            });
        } catch (e) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.patch("/updateserver/:id", adminAuthCheck, async (req, res) => {
        try {
            let {
                body,
                params: { id },
            } = req;
            delete body.tokenData;
            await serverModel.updateOne(
                {
                    _id: id,
                },
                body
            );
            res.send({
                code: 200,
                msg: "Data updated successfully !!",
            });
        } catch (e) {
            console.log(e);
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.delete("/delserver/:id", adminAuthCheck, async (req, res) => {
        try {
            const { id } = req.params;
            await serverModel.deleteOne({
                _id: id,
            });
            res.send({
                code: 200,
                msg: "success",
            });
        } catch (e) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.get("/serverget/:id", adminAuthCheck, async (req, res) => {
        try {
            const {
                params: { id },
            } = req;
            const serverdata = await serverModel
                .findById(id, {
                    ip: 1,
                    port: 1,
                    sshuser: 1,
                    sshpassword: 1,
                    rconpassword: 1,
                    servertype: 1,
                    _id: 1,
                })
                .lean();
            if (serverdata) {
                res.send({ code: 200, serverdata });
            } else {
                res.send({ code: 201 });
            }
        } catch (error) {
            console.log(error);
            res.send({
                code: 500,
                msg: "Some error has occured!",
            });
        }
    });
    //Add Tournament rules

    router.post("/add-tournament-rules", adminAuthCheck, async (req, res) => {
        try {
            const { body } = req;
            const savedData = await tournamentRulesModel.create(body);
            res.send({
                code: 200,
                msg: "success",
                savedData,
            });
        } catch (e) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.get("/tournament-rules", adminAuthCheck, async (req, res) => {
        try {
            const rules = await tournamentRulesModel.find().sort({ _id: -1 }).lean();
            res.send({
                code: 200,
                rules,
            });
        } catch (e) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.patch("/update-tournament-rules/:id", adminAuthCheck, async (req, res) => {
        try {
            let {
                body,
                params: { id },
            } = req;
            delete body.tokenData;
            await tournamentRulesModel.updateOne(
                {
                    _id: id,
                },
                body
            );
            res.send({
                code: 200,
                msg: "Data updated successfully !!",
            });
        } catch (e) {
            console.log(e);
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.delete("/delete-tournament-rules/:id", adminAuthCheck, async (req, res) => {
        try {
            const { id } = req.params;
            await tournamentRulesModel.deleteOne({
                _id: id,
            });
            res.send({
                code: 200,
                msg: "Rules deleted successfully",
            });
        } catch (e) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.get("/tournament-get/:id", adminAuthCheck, async (req, res) => {
        try {
            const {
                params: { id },
            } = req;
            const rulesData = await tournamentRulesModel.findById(id).lean();
            if (serverdata) {
                res.send({ code: 200, rulesData });
            } else {
                res.send({ code: 201 });
            }
        } catch (error) {
            console.log(error);
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    //All tickets list -
    router.get("/ticketlist", adminAuthCheck, async (req, res) => {
        try {
            const ticketlist = await TicketModel.find({})
                .populate({
                    path: "sender",
                    select: { username: 1, useravatar: 1 },
                })
                .sort({ _id: -1 })
                .lean();
            res.send({
                code: 200,
                ticketlist,
            });
        } catch (e) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    // This api is used to close the ticket -
    router.put("/closeticket/:id", adminAuthCheck, async (req, res) => {
        try {
            const {
                params: { id },
            } = req;
            const { status, _id } = await TicketModel.findById(id).lean();
            await TicketModel.updateOne(
                {
                    _id,
                },
                { status: status === "open" ? "close" : "open" }
            );
            res.send({
                code: 200,
                msg: status === "open" ? "Ticket closed successfully" : "Ticket open successfully",
            });
        } catch (e) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });
    //Post answer
    router.post("/postAnswer", adminAuthCheck, async (req, res) => {
        try {
            const {
                body: { answer, tk_id },
            } = req;
            await TicketModel.updateOne(
                { _id: tk_id },
                {
                    $push: {
                        replies: { answer, answeredAt: new Date() },
                    },
                }
            );
            res.send({ code: 200, msg: "Successfully posetd the answer" });
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.get("/allreports", adminAuthCheck, async (req, res) => {
        try {
            const allreportsData = await gameReportModel
                .find({})
                .populate({ path: "reportedBy", select: { username: 1 } })
                .populate({ path: "reportedTo", select: { username: 1 } });
            res.send({ code: 200, allreportsData });
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });

    router.get("/listallwithdrawRequest", adminAuthCheck, async (req, res) => {
        try {
            const withdrawRequest = await withdrawModel
                .find({})
                .populate({
                    path: "requestedBy",
                    select: { username: 1, useravatar: 1, paypalAccount: 1 },
                })
                .sort({ _id: -1 })
                .lean();
            res.send({ code: 200, withdrawRequest });
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });
    router.post("/payoutUser", adminAuthCheck, async (req, res) => {
        try {
            const { amount, email_address, requestid } = req.body;

            const sender_batch_id = Math.random().toString(36).substring(9);

            let create_payout_json = {
                sender_batch_header: {
                    sender_batch_id: sender_batch_id,
                    email_subject: "You have a payment",
                },
                items: [
                    {
                        recipient_type: "EMAIL",
                        amount: {
                            value: amount,
                            currency: "EUR",
                        },
                        receiver: email_address,
                        note: "Thank you.",
                        sender_item_id: "dummy",
                    },
                ],
            };

            let sync_mode = "false";

            paypal.payout.create(create_payout_json, sync_mode, async (error, payout) => {
                if (error) {
                    console.log(error);
                    res.send({
                        code: 500,
                        msg: "Internal server error !!",
                        error,
                    });
                } else {
                    console.log("Create Single Payout Response");
                    await withdrawModel.updateOne({ _id: requestid }, { approved: true, payout });
                    res.send({
                        code: 200,
                        msg: "Approved successfully",
                    });
                }
            });
        } catch (error) {
            console.log(error);
            res.send({
                code: 500,
                msg: "Internal server error !!",
                error,
            });
        }
    });
    /*************  Product Store **************/

    router.post("/addProduct", adminAuthCheck, async (req, res) => {
        const form = new multiparty.Form();
        form.parse(req, async (error, fields, files) => {
                if (error) {
                    console.log(error);
                }
            try {
                const {
                    body: {
                      tokenData: { admin },
                    },
                  } = req;
                if (req.query) {
                    const { path } = files.file[0];
                    const buffer = fs.readFileSync(path);
                    const type = await fileType.fromBuffer(buffer);
                    const timestamp = Date.now().toString();
                    const fileName = `bucketFolder/${timestamp}-lg`;
                    const hash = crypto.createHash("md5").update(fileName).digest("hex");
                    const data = await uploadFile(buffer, hash, type, "product");
                    req.query.image = data.Location;
                    req.query.createdby = admin;
                    const productData = new productModel(req.query);
                    await productData.save();
                    res.send({
                        code: 200,
                        msg: "Product added successfully",
                    });
                } else {
                    res.send({
                        code: 500,
                        msg: "Invalid data",
                    });
                }
            } catch (e) {
                res.send({
                    code: 500,
                    msg: "Internal server error!!",
                });
            }
        });
            return 0;
    });
    router.get("/getProduct", adminAuthCheck, async (req, res) => {
        try {
            const allproduct = await productModel.find({isredeem:false}).
            populate({
                path: "catid",
                select: { name: 1},
            }).lean();
            res.send({
                code: 200,
                allproduct,
            });
        } catch (e) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });
    router.delete("/deleteProduct/:_id", adminAuthCheck, async (req, res) => {
        try {
            const { _id } = req.params;
            await productModel.deleteOne({ _id });
            res.send({ code: 200, msg: "success" });
        } catch (e) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });
    router.get("/getProductById/:_id", adminAuthCheck, async (req, res) => {
        try {
            const { _id } = req.params;
            const data = await productModel.findById(_id).populate({
                path: "catid",
                select: { name: 1}
            }).lean();
            if (data) {
                res.send({
                    code: 200,
                    data,
                });
            } else {
                res.send({
                    code: 404,
                });
            }
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });
    router.patch("/updateProduct/:_id", adminAuthCheck, async (req, res) => {
        const form = new multiparty.Form();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log(error);
            }
            try {
                if (req.query) {
                    const { path } = files.file ? files.file[0] : {};
                    const { _id } = req.params;
                    const { title, content, price,media,catid,steamcode,quantity} = req.query;
                    if (path) {
                        const buffer = fs.readFileSync(path);
                        const type = await fileType.fromBuffer(buffer);
                        const timestamp = Date.now().toString();
                        const fileName = `bucketFolder/${timestamp}-lg`;
                        const hash = crypto.createHash("md5").update(fileName).digest("hex");
                        const data = await uploadFile(buffer, hash, type, "product");
                        if(req.query.media){
                            await productModel.updateOne(
                                { _id },
                                { title, content, steamcode,price, image: data.Location,catid,quantity,
                                 $push: {
                                    media
                                },
                                }
                            );
                            res.send({ code: 200, msg: "Product updated successfully" });
                        }else{
                            await productModel.updateOne(
                                { _id },
                                { title, content, price,steamcode, image: data.Location,catid,quantity}
                            );
                            res.send({ code: 200, msg: "Product updated successfully" });
                        }
                    } else {
                        if(req.query.media){
                            await productModel.updateOne({ _id }, { title, content, price,steamcode,catid,quantity,
                                $push: {
                                    media
                                },
                            });
                            res.send({ code: 200, msg: "Product updated successfully" });
                        }else{
                            await productModel.updateOne({ _id }, { title, content,steamcode, price,catid,quantity});
                            res.send({ code: 200, msg: "Product updated successfully" });
                        }
                    }
                } else {
                    res.send({
                        code: 500,
                        msg: "Invalid data",
                    });
                }
            } catch (e) {
                res.send({
                    code: 500,
                    msg: "Internal server error!!",
                });
            }
            return 0;
        });
    });

    router.post("/uploadMedia", adminAuthCheck, async (req, res) => {
        const form = new multiparty.Form();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log(error);
            }
            try {
                    let fileArray = [];
                    if (files) {
                        for (let i = 0; i < files.file.length; i++) {
                            let { path } = files.file ? files.file[i] : {};
                            const buffer = fs.readFileSync(path);
                            const type = await fileType.fromBuffer(buffer);
                            const timestamp = Date.now().toString();
                            const fileName = `bucketFolder/${timestamp}-lg`;
                            const hash = crypto.createHash("md5").update(fileName).digest("hex");
                            const data = await uploadFile(buffer, hash, type, "news");
                            const imageUrl = data.Location;
                            fileArray.push(imageUrl);
                        }
                        if(fileArray){
                            res.send({
                                code: 200,
                                fileArray,
                            }); 
                        }
                    }
            } catch (e) {
                res.send({
                    code: 500,
                    msg: "Internal server error!!",
                });
            }
            return 0;
        });
    });
     router.put("/deleteMedia/:index/:pid", adminAuthCheck, async (req, res) => {
        try {
            const {
                params: { index, pid },
            } = req;
            let queryObj = `media.${index}`;
            await productModel.updateOne(
                { _id: pid },
                {
                    $unset: {
                        [queryObj]: index,
                    },
                }
            );
            await productModel.updateOne(
                { _id: pid },
                {
                    $pull: {
                        media: null,
                    },
                }
            );
         res.send({ code: 200, msg: "Removed successfully" });
        } catch (error) {
            res.send({
                code: 500,
                msg: "Internal server error",
            });
        }
    });

    /********** product Category********** */
    
   router.post("/createcategory", adminAuthCheck, async (req, res) => {
    try {
        const { name } = req.body;
        const { isValid } = checkIfEmpty({ name });
        if (isValid) {
            const Createcategory = await categoryModel.create({
                name
            });
            if (Createcategory) {
                res.send({ code: 200, msg: "Created Successfully" });
            } else {
                res.send({
                    code: 401,
                    msg: "Unexpected error !!",
                });
            }
        } else {
            res.send({
                code: 201,
                msg: "Invalid request body",
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

router.get("/categoryslist", adminAuthCheck, async (req, res) => {
    try {
        const allcategorys = await categoryModel
            .find()
            .sort({ _id: -1 })
            .lean();
        res.send({ code: 200, allcategorys });
    } catch (error) {
        res.send({
            code: 500,
            msg: "Internal server error!!",
        });
    }
});

router.get("/categorybyid/:id", adminAuthCheck, async (req, res) => {
    try {
        const { id } = req.params;
        const data = await categoryModel
            .findOne(
                { $and: [{ _id: id }] },
                { name: 1}
            )
            .lean();
        res.send({ code: 200, data });
    } catch (error) {
        res.send({
            code: 500,
            msg: "Internal server error!!",
        });
    }
});


router.post("/updateCategory", adminAuthCheck, async (req, res) => {
    try {
        const {
            body: { name,id},
        } = req;
        const { isValid } = checkIfEmpty({ name });
        if (isValid) {
            await categoryModel.updateOne(
                { $and: [{ _id: id }] },
                { name }
            );
        res.send({ code: 200, msg: "Updated successfully" });
        } else {
            res.send({
                code: 201,
                msg: "Invalid request body",
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

router.delete("/deleteCategory/:_id", adminAuthCheck, async (req, res) => {
    try {
        const { _id } = req.params;
        await categoryModel.deleteOne({ _id });
        res.send({ code: 200, msg: "success" });
    } catch (e) {
        res.send({
            code: 500,
            msg: "Internal server error!!",
        });
    }
});

router.get("/allitemPruchesList", async (req, res) => {
    try {
        const allitemlist = await pruchesitemModel.find().
        populate({
            path: "purchaseby",
            select: { username: 1},
        }). populate({
            path: "pid",
            select: { title: 1},
        }).lean();
        res.send({
            code: 200,
            allitemlist,
        });
    } catch (e) {
        res.send({
            code: 500,
            msg: "Internal server error!!",
        });
    }
});


router.post("/createTournament", adminAuthCheck, async (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log(error);
            }
        try {
            const {
                body: {
                  tokenData: { admin },
                },
              } = req;
            if (req.query) {
                const { path } = files.file ? files.file[0] : {};
                const buffer = fs.readFileSync(path);
                const type = await fileType.fromBuffer(buffer);
                const timestamp = Date.now().toString();
                const fileName = `bucketFolder/${timestamp}-lg`;
                const hash = crypto.createHash("md5").update(fileName).digest("hex");
                const data = await uploadFile(buffer, hash, type, "tournament");
                req.query["createdBy"] = admin;
                req.query["onModel"] = "admin";
                req.query["banner"] = data.Location;
                const tournamentCreate = await tournamentModel.create(req.query);
                io.emit("GetCreateTournament", tournamentCreate);
                res.send({
                    code: 200,
                    msg: "Tournament added successfully",
                });
            } else {
                res.send({
                    code: 500,
                    msg: "Invalid data",
                });
            }
        } catch (e) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
    });
        return 0;
});
router.get("/tournaments", adminAuthCheck, async (req, res) => {
    try {
        const {
            body: { userid },
        } = req;
        const tournaments = await tournamentModel
        .find(
            {},
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
        res.send({ code: 200, tournaments, userid });
    } catch (error) {
        res.send({
            code: 500,
            msg: "Internal server error!!",
        });
    }
});
router.delete("/deleteTournament/:_id", adminAuthCheck, async (req, res) => {
    try {
        const { _id } = req.params;
        await tournamentModel.deleteOne({ _id });
        res.send({ code: 200, msg: "success" });
    } catch (e) {
        res.send({
            code: 500,
            msg: "Internal server error!!",
        });
    }
});
router.get("/getTournamentById/:_id", adminAuthCheck, async (req, res) => {
    try {
        const { _id } = req.params;
        const data = await tournamentModel.findById(_id).lean();
        if (data) {
            res.send({
                code: 200,
                data,
            });
        } else {
            res.send({
                code: 404,
            });
        }
    } catch (error) {
        res.send({
            code: 500,
            msg: "Internal server error!!",
        });
    }
});
router.patch("/updateTurnament/:_id", adminAuthCheck, async (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, async (error, fields, files) => {
        if (error) {
            console.log(error);
        }
        try {
            if (req.query) {
                const { path } = files.file ? files.file[0] : {};
                const { _id } = req.params;
                const {title,tournamentStart,tournamentPrize,playerNumbers,gameType,tournamentType} = req.query;
                if (path) {
                    const buffer = fs.readFileSync(path);
                    const type = await fileType.fromBuffer(buffer);
                    const timestamp = Date.now().toString();
                    const fileName = `bucketFolder/${timestamp}-lg`;
                    const hash = crypto.createHash("md5").update(fileName).digest("hex");
                    const data = await uploadFile(buffer, hash, type, "tournament");
                    await tournamentModel.updateOne(
                        { _id },
                        { 
                        title,tournamentStart,tournamentPrize,playerNumbers,gameType,tournamentType,banner: data.Location
                        }
                    );
                    res.send({ code: 200, msg: "Tournament updated successfully" });
                } else {
                    await tournamentModel.updateOne(
                        { _id },
                        { 
                        title,tournamentStart,tournamentPrize,playerNumbers,gameType,tournamentType
                        }
                    );
                    res.send({ code: 200, msg: "Tournament updated successfully" });
                }
            } else {
                res.send({
                    code: 500,
                    msg: "Invalid data",
                });
            }
        } catch (e) {
            res.send({
                code: 500,
                msg: "Internal server error!!",
            });
        }
        return 0;
    });
});
/* users admin section */
router.get("/alluserlist", adminAuthCheck, async (req, res) => {
    try {
        const alluser = await userModel
            .find({}, { username: 1, email: 1, isturnament: 1,isladders:1 })
            .sort({ _id: -1 })
            .lean();
        res.send({ code: 200, alluser });
    } catch (error) {
        res.send({
            code: 500,
            msg: "Internal server error!!",
        });
    }
});
   router.post("/updateuserRole", adminAuthCheck, async (req, res) => {
    try {
        const { type,id,status } = req.body;
        const { isValid } = checkIfEmpty({ id });
        if (isValid) {
            if(type ==='isturnament'){
                await userModel.updateOne(
                    { _id:id },
                    { 
                        isturnament:status
                    }
                );
               res.send({ code: 200, msg: "Assign Successfully" });
            }
            if(type ==='isladders'){ 
                await userModel.updateOne(
                    { _id:id },
                    { 
                        isladders:status
                    }
                );
                res.send({ code: 200, msg: "Assign Successfully" });
            }
        } else {
            res.send({
                code: 201,
                msg: "Invalid request body",
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
// router.delete("/deleteuser/:_id", adminAuthCheck, async (req, res) => {
//     try {
//         const { _id } = req.params;
//         await userModel.deleteOne({ _id });
//         res.send({ code: 200, msg: "success" });
//     } catch (e) {
//         res.send({
//             code: 500,
//             msg: "Internal server error!!",
//         });
//     }
// });

 return router;
};
export default AdminRoute;
