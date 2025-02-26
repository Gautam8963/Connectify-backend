const express = require('express');

const app = express();

const connectDB = require("./config/database");
const user = require('./models/user');

app.post("/signup", async (req,res)=>{
    const user = new user( {
        firstName : "Gautam",
        lastName : "Dhodi",
        emailId : "gautamdhodi02@gmail.com",
        password : "gautam123",
        age : 20,
        gender : "male",
    })
    await user.save();
    res.send("User added successfully ....")
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

 