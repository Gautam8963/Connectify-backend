const express = require('express');

const app = express();

app.use( "/test",(req,res) => {
    res.send("i am sending response ....")
} )

app.use("/hi",(req,res)=>{
    res.send("hello")
})

app.use("/try",(req,res)=>{
    res.send("try and testes api")
})

app.get("/user",(req,res)=>{
    console.log(req.query)
    res.send({
        firstName: "Gautam",
        lastname: "Dhodi"
    })
})

app.post("/user",(req,res)=>{
    res.send("Requested Posted Successfully")
})

app.patch("/user",(req,res)=>{
    res.send("Requested patched successfully")
})

app.listen(1111,()=>{
    console.log("Server has started on port 1111 .....")
})
 