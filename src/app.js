const express = require('express');
const app = express();
exports.app = app;
const connectDB = require("./config/database");
const User = require('./models/user');
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth }= require("./middlewares/auth")

app.use(cookieParser());
app.use(express.json());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestsRouter = require('./routes/request');
const useRouter = require('./routes/user');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestsRouter);
app.use("/",useRouter);

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

 