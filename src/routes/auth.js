const express = require('express');
const User = require('../models/user');
const{ validateSignUpData } = require("../utils/validation")
const bcrypt = require("bcrypt");
 const authRouter = express.Router();

authRouter.post("/signup", async (req,res)=>{

    try {
        // VALIDATION OF DATA
        validateSignUpData(req);

        const {firstName, lastName, emailId ,password} = req.body;
        //ENCYPT THE PASSWORD

        const passwordHash = await bcrypt.hash(password,10);
        // console.log(passwordHash);

        // CREATING A NEW INSTANCE OF THE USER MODEL
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("User added successfully ....")
    } catch (err) {
        res.status(400).send("Error saving the user :" + err.message);
    }
});

authRouter.post("/login", async (req,res) => {

    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});

        if(!user){
            throw new Error("Invalid Credentials ")
        }
        const isPasswordValid =  await user.validatePassword(password);

        if(isPasswordValid){

            // Create a JWT Token
            const token = await user.getJWT();

            // Add the token to the cookie and sendthe response back to the server
            res.cookie("token",token,{
                expires: new Date(Date.now() + 8 * 3600000)
            });

            res.send("Login Successfully!!");
        } else {
            throw new Error("Invalid Credentials");
        }

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

authRouter.post("/logout", async (req,res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout successfully")
})

module.exports = authRouter;