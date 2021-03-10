const mongoose = require('mongoose');
const GroupChatSchema = mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: 'friends with benifits'
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