const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // contactNumber: {
    //     countryCode: {
    //         type: String
    //     },
    //     phoneNumber: {
    //         type: String
    //     }
    // },
    password: {
        type: String,
        required: true,
        trim: true
    },
    refreshToken: {
        type: String,
        default: null,
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }
},
    {
        timestamps: true
    }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;