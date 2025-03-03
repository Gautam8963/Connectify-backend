const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require('./models/user');
const{ validateSignUpData } = require("./utils/validation")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth }= require("./middlewares/auth")

app.use(cookieParser());
app.use(express.json());

app.get("/get",(req,res)=>{
    const data = req.body;
})



// CREATING A NEW USER
app.post("/signup", async (req,res)=>{

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

//LOGIN API
app.post("/login", async (req,res) => {

    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});

        if(!user){
            throw new Error("Invalid Credentials ")
        }
        const isPasswordValid =  await bcrypt.compare(password, user.password);

        if(isPasswordValid){

            // Create a JWT Token
            const token = await jwt.sign({_id: user._id}, "DEV@Tinder$790",{
                expiresIn: '1d',
            });

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

// PROFILE API
app.get("/profile", userAuth, async (req,res) => {
    try {
    // const cookies = req.cookies;

    // const { token } = cookies;
    // if(!token){
    //     throw new Error("invalid Token");
    // }
    
    // const decodeMessage = await jwt.verify(token, "DEV@Tinder$790");
    // const { _id } = decodeMessage;

    const user = req.user;

    res.send(user);
    } catch (err) {
        res.status(400).send("ERROR : "+err.message);
    }
});

// SEND THE CONNCECTION REQUEST
app.post("/sendConnectionRequest",userAuth, (req,res) => {
    
    res.send("Sent the connection request")
})

connectDB()
    .then( ()=>{
        console.log("Database is connected");
    })
    .catch((err) => {
        console.error("Database cannot be connected");
    });
      
    app.listen(1111,()=>{
        console.log("Server has started on port 1111 .....")
    })

 