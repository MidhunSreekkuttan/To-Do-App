import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    profilePic: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        maxlength: 200,
        default: ""
    },

    phone: {
        type: String,
        default: ""
    },

    location: {
        type: String,
        default: ""
    },

    resetPasswordToken: {
        type: String,
        default: ""
    },

    resetPasswordExpires: {
        type: Date,
        default: null
    }

}, { timestamps: true })

const UserModel = mongoose.models.User || mongoose.model("User", userSchema)

export default UserModel