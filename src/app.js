const express = require('express');

const app = express();

app.use( "/test",(req,res) => {
    res.send("i am sending response ....")
} )

app.use("/hi",(req,res)=>{
    res.send("hello")
})

app.listen(1111,()=>{
    console.log("Server has started on port 1111 .....")
})
