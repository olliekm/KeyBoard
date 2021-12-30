const mongoose = require('mongoose')

const subscriberSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    subscribeDate:{
        type: Date,
        require: true,
        default: Date.now
    },
    lastName: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    likeCount: {
        type: Number,
        required: true
    },
    usersLiked: {
        type: [String],
        required: true
    }
})

module.exports = mongoose.model('Subscriber', subscriberSchema)