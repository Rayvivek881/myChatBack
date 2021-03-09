const mongoose = require('mongoose');
const GroupChatSchema = mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    Admin: {
        type: String, // [name, id]
        required: true
    },
    requests: {
        type : Array,
        default: []
    },
    members: {
        type : Array, // [name, id] of every members
        default: []
    },
    messages: {
        type: Array, // [senderid, name, messages]
        default: []
    }
}, {timestamps: true});
const GroupChat = mongoose.model('GroupChat', GroupChatSchema);
module.exports = GroupChat;