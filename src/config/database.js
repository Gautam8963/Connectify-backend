const mongoose = require("mongoose")

const connectDB = async ()=>{
    await mongoose.connect(
        "mongodb+srv://gautam:ZnSeIdkvAZ1v2rZ6@devtinderr.bzsbz.mongodb.net/Tinder", {
            useUnifiedTopology: true,
            tls: true,  // Ensures a secure TLS connection
        }
    )
}

module.exports = connectDB;