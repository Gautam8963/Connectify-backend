const express = require('express');

const app = express();

app.use(express.json())

const connectDB = require("./config/database");
const User = require('./models/user');

app.get("/get",(req,res)=>{
    const data = req.body;
    console.log(data)
})



app.post("/signup", async (req,res)=>{
    const user = new User( {
        firstName : "Siddarth",
        lastName : "jain",
        emailId : "sid@gmail.com",
        password : "sid123",
        age : 20,
        gender : "male",
    });

    try {
        await user.save();
        res.send("User added successfully ....")
    } catch (err) {
        res.status(400).send("Error saving the user :" + err.message);
    }
});

app.get("/userData", async (req,res)=>{
    const data = req.body.email;
    try {
        const users = await User.find({})
        res.send(users)
    }
    catch(err){
        err.status(400).send("Something went wrong")
    }
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

 