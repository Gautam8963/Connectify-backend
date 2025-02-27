const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    emailId: {type: String},
    password: {type: String},
    age: {type: Number},
    gender: {type: String},
    createdAt: {type: Date,default: Date.now,}
})

module.exports = mongoose.model("User", userSchema);
