const jwt = require('jsonwebtoken');
const User = require("../models/user");
require("dotenv").config();

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Token is not valid !!");
        }

        // Use SECRET_KEY from .env
        const decodeObj = jwt.verify(token, process.env.JWT_SECRET);

        const { _id } = decodeObj;
        const user = await User.findById(_id);

        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Auth Error:', err);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    userAuth,
};