const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    profilePicture: {
        type: String,
        required: false
    },
    profileBanner: {
        type: String,
        required: false
    },
    posts: {
        type: [],
        required: false
    },
    favoriteBoard: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('User', userSchema)