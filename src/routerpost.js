const express = require("express");
const routerPost = new express.Router();
const Authentication = require('./middleware/authentication')
const Post = require('../models/Post');
const UserData = require('../models/auth');

routerPost.post('/createpost', Authentication, async (req, res) => {
    const { myid } = req.user;
    const {image, Title, data} = req.body;
    const newpost = new Post({
        image,
        Title,
        data,
        userid: myid
    });
    const result = await newpost.save();
    const result1 = await UserData.updateOne({_id: myid}, {
        $push : {
            posts : result._id 
        }
    }, { useFindAndModify: false });
    res.send({message: 'post created'});
})

routerPost.get('/mypost/:id',  async (req, res) => {
    const { id } = req.params;
    const result = await UserData.findById(id).select({posts: true});
    let getit = [];
    for (let item in result.posts) {
        getit.push({_id: item});
    }
    const myposts = await Post.find({$or: getit});
    res.send({myposts: myposts});
})

routerPost.delete('/mypost', Authentication, async (req, res) => {
    const { myid } = req.user, { postid } = req.quary;
    const result = await Post.deleteOne({_id: postid});
    const result1 = await UserData.updateOne({_id: myid}, {
        $pull: {
            posts: postid
        }
    }, { useFindAndModify: false });
    res.send({message: 'post deleted'});
});

routerPost.put('/like', Authentication, async(req, res) => {
    const { myid } = req.user, { postid } = req.quary;
    const result = await Post.updateOne({_id: postid}, {
        $push : {
            likes: myid
        }
    }, { useFindAndModify: false });
    res.send({});
})

routerPost.put('/rmlike', Authentication, async(req, res) => {
    const { myid } = req.user, { postid } = req.quary;
    const result = await Post.updateOne({_id: postid}, {
        $pull : {
            likes: myid
        }
    }, { useFindAndModify: false });
    res.send({});
})

routerPost.put('/comment', Authentication, async(req, res) => {
    const { myid } = req.user, { postid, data } = req.body;
    const result = await Post.updateOne({_id: postid}, {
        $push : {
            Comments: [myid, data]
        }
    }, { useFindAndModify: false });
    res.send({});
})

routerPost.put('/rmcomment', Authentication, async(req, res) => {
    const { myid } = req.user, { postid, data } = req.body;
    const result = await Post.updateOne({_id: postid}, {
        $pull : {
            Comments: [myid, data]
        }
    }, { useFindAndModify: false });
    res.send({});
})

routerPost.patch('/editpost', Authentication, async (req, res) => {
    const {image, Title, data, postid} = req.body;
    const result = await Post.updateOne({_id: postid}, {
        $set: {
            image,
            Title,
            data
        }
    }, { useFindAndModify: false });
    res.send({message: 'post edited'})
});

module.exports = routerPost;