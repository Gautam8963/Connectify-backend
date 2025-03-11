const express = require("express");
const useRouter = express.Router();
const User = require('../models/user');
require("dotenv").config()

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest')

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

useRouter.get(
    "/user/requests/received",
    userAuth,
    async (req, res) => {
        try {
            const loggedInUser = req.user;

            const connectionRequests = await ConnectionRequest.find({
                toUserId: loggedInUser._id,
                status: "interested",
            })
                .populate("fromUserId", USER_SAFE_DATA);

            res.json({
                message: "Data fetched successfully",
                data: connectionRequests,
            })
        } catch (err) {
            res.statusCode(400).send("ERROR : " + err.message)
        }
    }
)

useRouter.get(
    "/user/connections",
    userAuth,
    async (req, res) => {
        try {
            const loggedInUser = req.user;

            const connectionRequests = await ConnectionRequest.find({
                $or: [
                    { toUserId: loggedInUser._id, status: "accepted" },
                    { fromUserId: loggedInUser._id, status: "accepted", }
                ],
            })
                .populate("fromUserId", USER_SAFE_DATA)
                .populate("toUserId", USER_SAFE_DATA);

            // console.log(connectionRequests)

            const data = connectionRequests.map((row) => {
                if (row.fromUserId.toString() === loggedInUser.toString()) {
                    return row.toUserId;
                }
                return row.fromUserId;
            });

            res.json({ data });
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    }
);

useRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        // Logic for 10 users at a time 
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ],
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        // finding all users
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        })
            .select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);

        res.json({
            message: "Data fethed successfully ",
            data: users
        }
        );
    } catch (err) {
        res.status(400).json({ message: err.message + "not fetch" });
    }
}
);
module.exports = useRouter;