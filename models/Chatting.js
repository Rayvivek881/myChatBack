const mongoose = require('mongoose');
const ChatSchema = mongoose.Schema({
    friend1: {
        type: String,
        required: true
    },
    friend2: {
        type: String,
        required: true
    },
    messages: {
        type : Array,
        default: []
    }
}, {timestamps: true});
const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;