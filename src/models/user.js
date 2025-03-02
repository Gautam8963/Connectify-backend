const mongoose = require("mongoose")

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
        },
        validate: {
            validator: async function (value) {
                const user = await this.constructor.findOne({ emailId: value });
                if (user) {
                    throw new Error("Email already exists.");
                }
            },
            message: "Email already exists."
        }
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
})

module.exports = mongoose.model("User", userSchema);
