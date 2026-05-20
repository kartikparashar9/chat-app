const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: function () {
            return !this.googleId;
        }
    },

    googleId: {
        type: String,
        default: null
    },

    avatar: {
        type: String,
        default: ""
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "other"
    },

    dob: {
        type: Date,
        required: true
    },

    bio: {
        type: String,
        default: ""
    },

    isOnline: {
        type: Boolean,
        default: false
    },

    lastSeen: {
        type: Date,
        default: null
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);