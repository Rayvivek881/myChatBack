const mongoose = require('mongoose');
const loginSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: ''
    },
    friendChats: {
        type: Map,
        default: {}
    },
    friendrequest: {
        type: Array,
        default: []
    },
    newmessage: {
        type: Array,
        default: []
    },
    posts: {
        type: Array,
        default: []
    },
    friends: {
        type: Array,
        default: []
    }
}, {timestamps: true});
const UserData = mongoose.model('UserData', loginSchema);
module.exports = UserData;