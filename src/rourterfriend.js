const express = require("express");
const routerFriend = new express.Router();
const UserData = require('../models/auth');
const Authentication = require('./middleware/authentication')
const Chat = require('../models/Chatting.js');
const GroupChat = require('../models/groupChatting')

routerFriend.get('/profile', async (req, res) => {
    const { username, isEditable } = req.body;
    const result = await UserData.findOne({ username: username }).select({ friendChats: false, password: false });
    res.send({ isEditable: isEditable, data: result });
})

routerFriend.put('/friendreq', Authentication, async (req, res) => {
    const { myid, fullname } = req.user;
    const { friendid } = req.query;
    const result = await UserData.updateOne({ _id: friendid }, {
        $addToSet: {friendrequest: JSON.stringify([myid, fullname]) },
        $addToSet: {notifications: JSON.stringify([myid, `${fullname} has sent you a friend request
                        you can watch his profile by clicking on me`]) },
        $inc: {newnotifications: 1}  
    }, { useFindAndModify: false })
    res.send({ status: 'added' });
})

routerFriend.put('/friendacc', Authentication, async (req, res) => {
    const { friendid, name } = req.query, { myid, fullname } = req.user;
    console.log(req.query);
    console.log(req.user);
    const newFriendShip = new Chat({
        friend1: JSON.stringify([myid, fullname, 0]),
        friend2: JSON.stringify([friendid, name, 0])
    });
    const result = await newFriendShip.save();
    const result2 = await UserData.updateOne({ _id: myid }, {
        $push: { friends: JSON.stringify([friendid, name, result._id]) },
        $pull: { friendrequest: JSON.stringify([friendid, name]) }
    }, { useFindAndModify: false });
    const result1 = await UserData.updateOne({ _id: friendid }, {
        $push: { friends: JSON.stringify([myid, fullname, result._id]) }
    }, { useFindAndModify: false });
    res.send({})
});

routerFriend.patch('/massage', Authentication, async (req, res) => {
    const { messageid, message , vk } = req.body, { myid } = req.user;
    console.log(req.body);
    const data = await Chat.findById(messageid).select({ messages: false });
    if (JSON.parse(data.friend1)[0] == myid) {
        const temp = JSON.parse(data.friend2);
        temp.splice(2, 1);
        temp.push(JSON.parse(data.friend2)[2] + 1)
        const result1 = await Chat.updateOne({ _id: messageid }, {
            $set: {
                friend2: JSON.stringify(temp)
            }, 
            $push: {
                messages: JSON.stringify([myid, message])
            }
        });
        const result = await UserData.updateOne({_id: JSON.parse(data.friend2)[0]}, {
            $inc: {newmessage: 1}
        })
    } else {
        const temp = JSON.parse(data.friend1);
        temp.splice(2, 1);
        temp.push(JSON.parse(data.friend1)[2] + 1);
        const result2 = await Chat.updateOne({ _id: messageid }, {
            $set: {
                friend1: JSON.stringify(temp)
            }, $push: {
                messages: JSON.stringify([myid, message])
            }
        });
        const result = await UserData.updateOne({_id: JSON.parse(data.friend1)[0]}, {
            $inc: {newmessage: 1}
        })
    }
    res.send({});
})

routerFriend.put('/friendmassage', Authentication, async (req, res) => {
    const { myid, friendid } = req.query;
    const result = await UserData.findById(myid).select({ friendChats: true });
    result.friendChats[friendid][unseen] = 0;
    res.send({ data: result.friendChats[friendid] })
})

routerFriend.get('/newchats', Authentication, async (req, res) => {
    const { myid } = req.user;
    const result = await UserData.findById(myid).select({ friendChats: true });
    let data = [];
    for (var i in result.friendChats) {
        if (result.friendChats[i][unseen]) {
            data.push([result.friendChats[i]])
        }
    }
    res.send({ dataArray: data });
});

routerFriend.put('/setStatus', Authentication, async (req, res) => {
    const { myid } = req.user;
    const result = await UserData.updateOne({ _id: myid }, {
        $set: {
            status: req.body.status
        }
    }, { useFindAndModify: false });
    res.send({ updated: true })
});

routerFriend.post('/changeprofile', Authentication, async (req, res) => {
    const { myid } = req.user;
    const { fullname, image } = req.body;
    const result = await UserData.updateOne({ _id: myid }, {
        $set: {
            fullname: fullname,
            image: image
        }
    }, { useFindAndModify: false })
    res.send({ updated: true });
})

routerFriend.patch('/unfriend', Authentication, async (req, res) => {
    const { myid } = req.user, { friendid } = req.query;
    const result1 = await UserData.updateOne({ _id: myid }, {
        $push: {
            friends: friendid
        }
    }, { useFindAndModify: false });
    const result2 = await UserData.updateOne({ _id: friendid }, {
        $push: {
            friends: myid
        }
    }, { useFindAndModify: false });
    const data = await UserData.find({ $or: [{ _id: myid }, { _id: friendid }] }).select({ friendChats: true });
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
    const result3 = await UserData.updateOne({ _id: myid }, {
        $set: {
            friendChats: mydata
        }
    }, { useFindAndModify: false });
    const result4 = await UserData.updateOne({ _id: friendid }, {
        $set: {
            friendChats: frienddata
        }
    }, { useFindAndModify: false });
    res.send({});
})

routerFriend.delete('/friendreq', Authentication, async (req, res) => {
    const { myid } = req.user;
    const { friendid, name } = req.query;
    console.log(req.query);
    const result = await UserData.updateOne({ _id: myid }, {
        $pull: { friendrequest: JSON.stringify([friendid, name]) }
    }, { useFindAndModify: false })
    res.send({ status: 'added' });
})

routerFriend.post('/prevmessage', Authentication, async (req, res) => {
    const result = await Chat.findById(req.body.mid);
    if (result == null) {
        const result1 = await GroupChat.findById(req.body.mid);
        console.log(result1);
        res.send({ result: result1 });
    }
    else {
        console.log(result);
        res.send({ result: result });
    }
})

module.exports = routerFriend;