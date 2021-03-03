const mongoose = require('mongoose');
const ChatSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    FriendChats: {
        type: Array,
        required: true
    }
}, {timestamps: true});
const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;