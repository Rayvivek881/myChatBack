const mongoose = require('mongoose');
const ChatSchema = mongoose.Schema({
    friend1: {
        typeof: String, // [id, fullName, unseen] of first friend
        required: true
    },
    friend2: {
        typeof: String, //  [id, fullName, unseen] of secand friend
        required: true
    },
    messages: {
        typeof : Array, // every element of array should be [senderid, message]
        default: []
    }
}, {timestamps: true});
const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;