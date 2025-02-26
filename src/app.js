const express = require('express');

const app = express();

const connectDB = require("./config/database")

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
 