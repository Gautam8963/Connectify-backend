const express = require('express');
const { userAuth }= require("../middlewares/auth");
const { validateEditProfileData} = require('../utils/validation')

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req,res) => {
    try {

    const user = req.user;

    res.send(user);
    } catch (err) {
        res.status(400).send("ERROR : "+err.message);
    }
});

profileRouter.patch("/profile/edit",  userAuth,async (req,res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit request")
        }

        const loggesInUser = req.user;

        Object.keys(req.body).forEach((key)=> (loggesInUser[key] = req.body[key]));

        await loggesInUser.save();

        res.json({
            message: `${loggesInUser.firstName}, Your profile updated successfully`,
            data: loggesInUser
        })

       //  res.send(`${loggesInUser.firstName}, your profile updated successfully `);
    } catch (err) {
        res.status(400).send("Error : " + err.message)
    }
});

module.exports = profileRouter