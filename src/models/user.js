const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 15
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 15
    },
    emailId: {
        type: String,
        required: true,
        unique: true, // This adds the uniqueness constraint at the database level
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email id is not valid"+value)
            }
        }
        // ,
        // validate: {
        //     validator: async function (value) {
        //         const user = await this.constructor.find({ emailId: value });
        //         if (user) {
        //             throw new Error("Email already existszzz.");
        //         }
        //     },
        //     message: "Email already exists."
        // }
    },
    password: {
        type: String,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong"+value)
            }
        }
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 18 || value > 50) {
                throw new Error("You are not eligible for this platform");
            }
        }
    }
    ,
    gender: {
        type: String,
        lowercase: true,
        validate(value){
            if (!["male", "female", "others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        },
    },
    createdAt: {
        type: Date,default: Date.now,
    },
    photoUrl: {
        type: String,
        default: "https://pinnacle.works/dummy-image/",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("URL is not valid"+value)
            }
        }
    },
    about: {
        type: String,
        default: "This is the about section"
    },
    skills: {
        type: [String],
    },
},
{
    timestamps: true
});

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id}, "DEV@Tinder$790", {
        expiresIn: "7d",
    });

    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    )
    return isPasswordValid
}

module.exports = mongoose.model("User", userSchema);
