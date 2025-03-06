const express = require("express");
const useRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest')

useRouter.get(
    "/user/requests/recieved",
    userAuth,
    async (req, res) => {
        try {
            const loggedInUser = req.user;

            const connectionRequests = await ConnectionRequest.find({
                toUserId: loggedInUser._id,
                status: "interested",
            })
            .populate("fromUserId", ["firstName","lastName"]);

            res.json({
                message: "Data fetched successfully",
                data: connectionRequests,
            })
        } catch (err) {
            res.statusCode(400).send("ERROR : " + err.message )
        }
    }
)

module.exports = useRouter;