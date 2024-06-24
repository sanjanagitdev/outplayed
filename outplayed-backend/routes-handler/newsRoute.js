import express from "express";
import mongoose from "mongoose";
import { userAuthCheck, checkForLoggedIn } from "../middleware/checkAuth";
import newsModel from "../models/news";
import userModel from "../models/user";
import commentModel from "../models/comment";
import { checkIfEmpty } from "../functions";

const router = new express.Router();
const NewsRoute = () => {
  /**
   * This is the news route handler all the news specific
   * apis are performed from here
   */
  router.get("/getnews/:skip/:limit", checkForLoggedIn, async (req, res) => {
    try {
      const { userid } = req.body;
      const { skip, limit } = req.params;

      const allnews = await newsModel
        .find()
        .sort({ createdAt: -1 })
        .skip(parseInt(skip)) // Always apply 'skip' before 'limit'
        .limit(parseInt(limit))
        .lean();
      res.send({
        code: 200,
        allnews,
        userid: userid,
      });
    } catch (e) {
      console.log(e);
      res.send({
        code: 500,
        msg: "Internal server error!!",
      });
    }
  });

  router.get("/lastpublisded", async (req, res) => {
    try {
      /**
       * We are using this api to get last published news for slider
       */
      const slidenews = await newsModel
        .find({}, { title: 1, imgurl: 1, content: 1 })
        .sort({ createdAt: -1 })
        .limit(4)
        .lean();
      res.send({
        code: 200,
        slidenews,
      });
    } catch (e) {
      res.send({
        code: 500,
        msg: "Internal server error!!",
      });
    }
  });

  router.put("/like/:_id", userAuthCheck, async (req, res) => {
    try {
      /**
       * This api route is used to like on the news
       */
      const { _id } = req.params;
      const { userid } = req.body.tokenData;
      let id = mongoose.Types.ObjectId(userid);
      let updateBy = {};
      const FindLike = await newsModel.findOne({
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
      await newsModel.updateOne({ _id }, updateBy);
      res.send({
        code: 200,
      });
    } catch (e) {
      res.send({
        code: 500,
        msg: "Internal server error!!",
      });
    }
  });

  router.get(`/newsdetail/:_id`, checkForLoggedIn, async (req, res) => {
    try {
      /**
       * This api route is used to get news deatils
       * We also count loggedin users views ,when any loggedin user open the news
       */
      const { userid } = req.body;
      const { _id } = req.params;
      let update = { $addToSet: {} };
      if (userid) {
        update.$addToSet.views = userid;
      } else {
        update.$addToSet.views = userid;
      }
      const newsData = await newsModel
        .findByIdAndUpdate(_id, update, { new: true })
        .populate({
          path: "comments",
          populate: {
            path: "commentby",
            select: {
              useravatar: 1,
              username: 1,
              steamavatar: 1,
            },
          },
          options: {
            sort: "-date",
          },
        });
      res.send({ code: 200, newsData, userid: userid });
    } catch (e) {
      res.send({
        code: 500,
        msg: "Internal server error!!",
      });
    }
  });

  router.post("/postcomment", userAuthCheck, async (req, res) => {
    try {
      /**
       * This api route is used to post the comments on the news
       * We returned posted comment in the response
       */
      const { comment, news_id } = req.body;
      const { tokenData } = req.body;
      const { isValid } = checkIfEmpty({ comment, news_id });
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
        await newsModel.updateOne(
          {
            _id: news_id,
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
      res.send({
        code: 500,
        msg: "Internal server error!!",
      });
    }
  });
  return router;
};
export default NewsRoute;
