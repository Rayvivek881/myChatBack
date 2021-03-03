const express = require("express");
const routerFriend = new express.Router();
const UserData = require('../models/auth');
const Authentication = require('./middleware/authentication')

routerFriend.get('/profile', async(req, res) => {
    const {username, isEditable} = req.body;
    const result = await UserData.findOne({username: username}).select({friendChats: false, password: false});
    res.send({isEditable: isEditable, data: result});
})

routerFriend.put('/friendreq', async(req, res) => {
    const {myid, friendid} = req.query;
    const result = await UserData.updateOne({_id: friendid}, {
        $push: {friendrequest: myid}
    }, { useFindAndModify: false })
    res.send({status: 'added'});
})

routerFriend.put('/friendacc', Authentication, async (req, res) => {
    const {myid, friendid} = req.query;
    const data = await UserData.find({$or: [{_id: myid}, {_id: friendid}]}).select({friendChats: true, fullname: true});
    let mydata, frienddata;
    if (data[0]._id == myid) {
        mydata = data[0];
        frienddata = data[1];
    } else {
        mydata = data[1];
        frienddata = data[0];
    }
    if (mydata.friendChats[friendid] != undefined) {
        res.send({});
    }
    const mynewdata = {
        unseen: 0,
        name: frienddata.fullname,
        chats: [],
    }
    const friendsnewdata = {
        unseen: 0,
        name: mydata.fullname,
        chats: []
    }
    const result = await UserData.updateOne({_id: myid}, {
        $set : {
            friendChats: {
                ...mydata.friendChats,
                friendid: mynewdata
            }
        }
    }, { useFindAndModify: false });
    const result2 = await UserData.updateOne({_id: myid}, {
        $push : {
            friends: friendid
        }
    }, { useFindAndModify: false });
    const result6 = await UserData.updateOne({_id: friendid}, {
        $push : {
            friends: myid
        }
    }, { useFindAndModify: false });
    const result1 = await UserData.updateOne({_id: friendid}, {
        $set : {
            friendChats: {
                ...frienddata.friendChats,
                myid: friendsnewdata
            }
        }
    }, { useFindAndModify: false });
    res.send({});
});

routerFriend.patch('/massage', Authentication, async (req, res) => {
    const {myid, friendid, message} = req.body;
    const data = await UserData.find({$or: [{_id: myid}, {_id: friendid}]}).select({friendChats: true, newmessage: true});
    let mydata, frienddata;
    if (data[0]._id == myid) {
        mydata = data[0];
        frienddata = data[1];
    } else {
        mydata = data[1];
        frienddata = data[0];
    }
    mydata.friendChats[friendid][chats].push([0, message, Date.now()]);
    const result = await UserData.updateOne({_id: myid}, {
        $set: {
            friendChats: mydata.friendChats
        }
    }, { useFindAndModify: false });
    frienddata.friendChats[myid][chats].push([1, message, Date.now()]);
    frienddata.friendChats[myid][unseen] += 1;
    frienddata.newmessage.push(myid);
    const result1 = await UserData.updateOne({_id: friendid}, {
        $set: {
            friendChats: frienddata.friendChats,
            newmessage: frienddata.newmessage
        }
    }, { useFindAndModify: false }); 
    res.send({isSend: true, friendname: frienddata.friendChats.name});
})

routerFriend.put('/friendmassage', Authentication, async (req, res) => {
    const {myid, friendid} = req.query;
    const result = await UserData.findById(myid).select({friendChats: true});
    result.friendChats[friendid][unseen] = 0;
    res.send({data: result.friendChats[friendid]})
})

routerFriend.get('/friends', Authentication, async(req, res) => {
    const { myid } = req.user;
    const result = await UserData.findById(myid).select({friendChats: true});
    let data = [];
    for(var i in result.friendChats) {
        data.push(result.friendChats[i]);
    }
    res.send({data: data})
});

routerFriend.get('/newchats', Authentication, async(req, res) => {
    const { myid } = req.user;
    const result = await UserData.findById(myid).select({friendChats: true});
    let data = [];
    for(var i in result.friendChats) {
        if (result.friendChats[i][unseen]) {
            data.push([result.friendChats[i]])
        }
    }
    res.send({dataArray: data});
});

routerFriend.put('/setStatus', Authentication, async (req, res) => {
    const { myid } = req.user;
    const result = await UserData.updateOne({_id: myid}, {
        $set: {
            status: req.body.status
        }
    }, { useFindAndModify: false });
    res.send({updated: true})
});

routerFriend.post('/changeprofile', Authentication, async (req, res) => {
    const { myid } = req.user;
    const {fullname, image} = req.body;
    const result = await UserData.updateOne({_id: myid}, {
        $set: {
            fullname: fullname,
            image: image
        }
    }, { useFindAndModify: false })
    res.send({updated: true});
})

routerFriend.patch('/unfriend', Authentication, async (req, res) => {
    const { myid } = req.user, { friendid } = req.query;
    const result1 = await UserData.updateOne({_id: myid}, {
        $push: {
            friends: friendid
        }
    }, { useFindAndModify: false });
    const result2 = await UserData.updateOne({_id: friendid}, {
        $push: {
            friends: myid
        }
    }, { useFindAndModify: false });
    const data = await UserData.find({$or: [{_id: myid}, {_id: friendid}]}).select({friendChats: true});
    let mydata, frienddata;
    if (data[0]._id == myid) {
        mydata = data[0].friendChats;
        frienddata = data[1].friendChats;
    } else {
        mydata = data[1].friendChats;
        frienddata = data[0].friendChats;
    }
    delete mydata[friendid];
    delete frienddata[myid];
    const result3 = await UserData.updateOne({_id: myid}, {
        $set : {
            friendChats: mydata
        }
    }, { useFindAndModify: false });
    const result4 = await UserData.updateOne({_id: friendid}, {
        $set : {
            friendChats: frienddata
        }
    }, { useFindAndModify: false });
    res.send({});
})

module.exports = routerFriend;