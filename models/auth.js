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
        default: 'hello i am using this site it very intersting'
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
        type: Number,
        default: 0 
    },
    newnotifications: {
        type: Number,
        default: 0 
    },
    posts: {
        type: Array,
        default: []
    },
    friends: {
        type: Array,
        default: []
    },
    groups: {
        type: Array,
        default: []
    }, 
    notifications: {
        type: Array,
        default: []
    }
}, {timestamps: true});
const UserData = mongoose.model('UserData', loginSchema);
module.exports = UserData;