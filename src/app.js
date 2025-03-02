const express = require('express');

const app = express();

app.use(express.json())

const connectDB = require("./config/database");
const User = require('./models/user');

app.get("/get",(req,res)=>{
    const data = req.body;
    console.log(data)
})



// CREATING A NEW USER
app.post("/signup", async (req,res)=>{
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User added successfully ....")
    } catch (err) {
        res.status(400).send("Error saving the user :" + err.message);
    }
});


// GET USER BY EMAIL 
app.get("/user", async (req,res)=>{
    const email = req.body.email;
    try {
        console.log(email);
        const user = await User.findOne({emailId:email})
        if(!user){
            res.status(400).send("User not found");
        } else{
            res.send(users)
        }

    }
    catch(err){
        err.status(400).send("Something went wrong")
    }
});


// FEED API - ALL USERS DATA
app.get("/user", async (req,res)=>{
    try {
        const users = await User.find({})
        res.send(users)
    }
    catch(err){
        err.status(400).send("Something went wrong")
    }
});


// UPDATE data of the user
app.patch("/user/:userId", async(req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;



    try {
        const ALLOWED_UPDATES = [
            "photoUrl",
            "about",
            "gender",
            "age"
        ]

        const isUpdateAllowed = Object
        .keys(data)
        .every(k => ALLOWED_UPDATES
        .includes(k));
    
        if(!isUpdateAllowed) {
            throw new Error("This updates are not allowed")
        }

        if(data?.skills?.length > 10) {
            throw new Error("Skills cannot be more than 10")
        }

        const user = await User.findByIdAndUpdate({_id: userId}, data, {
            returnDocument: "after",
            runValidators: true,
        });
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("Something went wromng");
    }
});

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

 