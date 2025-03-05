const express = require('express');
const { userAuth }= require("../middlewares/auth")

const requestsRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const user = require('../models/user');

requestsRouter.post(
    "/request/send/:status/:toUserId",
    userAuth, 
    async (req,res) => {
    
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored","interested"];
        if (!allowedStatus.includes(status)) {
            return res
                .status(400)
                .json({message: "Invalid Status Type: " + status})
        }

        //If user is not present in DB
        const toUser = await user.findById(toUserId);
        if(!toUser) {
            return res.status(404).json({message: "User not found !" });
        }


        // If Request Already Exists
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId},
                {fromUserId : toUserId, toUserId : fromUserId}
            ],
        });
        if(existingConnectionRequest) {
            return res
                .status(400)
                .send({ message: "Connetion Request already exists !!!"})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message: req.user.firstName+"is "+status+" by/in "+toUser.firstName,
            data,
        })

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }

   // res.send(user.firstname + "Sent the connection request")
})

module.exports = requestsRouter;