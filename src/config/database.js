const mongoose = require("mongoose")

const connectDB = async ()=>{
    await mongoose.connect(
        "mongodb+srv://gautam:ZnSeIdkvAZ1v2rZ6@devtinderr.bzsbz.mongodb.net/Tinder"
    )
}

module.exports = connectDB;