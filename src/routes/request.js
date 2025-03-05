const express = require('express');
const { userAuth }= require("../middlewares/auth")

const requestsRouter = express.Router();

requestsRouter.post("/sendConnectionRequest",userAuth, (req,res) => {
    
    res.send("Sent the connection request")
})

module.exports = requestsRouter;