const express = require('express');
const User = require('../models/user');
const{ validateSignUpData } = require("../utils/validation")
const bcrypt = require("bcrypt");
 const authRouter = express.Router();

authRouter.post("/signup", async (req,res)=>{

    try {
        // VALIDATION OF DATA
        validateSignUpData(req);

        const {firstName, lastName, emailId ,password, photoUrl,about, skills, age, gender} = req.body;
        //ENCYPT THE PASSWORD

        const passwordHash = await bcrypt.hash(password,10);
        // console.log(passwordHash);

        // CREATING A NEW INSTANCE OF THE USER MODEL
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            photoUrl,
            about,
            skills,
            age,
            gender
        });

        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        
        return res.json({
            message: "User added successfully....",
            data: savedUser
        });
        res.send("User added successfully ....")
    } catch (err) {
        return res.status(400).send("Error saving the user :" + err.message);
    }
});

authRouter.post("/login", async (req,res) => {
    try {
        console.log("Login attempt with body:", req.body);
        const {emailId, password} = req.body;
        
        if (!emailId || !password) {
            return res.status(400).json({ 
                status: "error",
                message: "Email and password are required" 
            });
        }

        const user = await User.findOne({emailId: emailId});
        // console.log("User found:", user ? "Yes" : "No");

        if(!user){
            return res.status(400).json({ 
                status: "error",
                message: "Account not found. Please sign up first." 
            });
        }

        const isPasswordValid = await user.validatePassword(password);
        // console.log("Password valid:", isPasswordValid ? "Yes" : "No");

        if(!isPasswordValid) {
            return res.status(400).json({ 
                status: "error",
                message: "Invalid password" 
            });
        }

        // Create a JWT Token
        const token = await user.getJWT();

        // Add the token to the cookie
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        // Send success response
        return res.json({
            status: "success",
            message: "Logged in successfully",
            data: {
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailId: user.emailId,
                    photoUrl: user.photoUrl,
                    about: user.about,
                    skills: user.skills,
                    isPremium: user.isPremium
                }
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(400).json({ 
            status: "error",
            message: "An error occurred during login. Please try again." 
        });
    }
});

authRouter.post("/logout", async (req,res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout successfully")
})

module.exports = authRouter;