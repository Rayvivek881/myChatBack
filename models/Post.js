const mongoose = require('mongoose');
const PostSchema = mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    likes: {
        type: Array,
        default: []
    },
    Title: {
        type: String,
        required: true,
    },
    data: {
        type: String,
        required: true,
    },
    Comments: {
        type: Array,
        default: []
    }
}, {timestamps: true});
const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
