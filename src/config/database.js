const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        throw error;
    }
}

module.exports = connectDB;