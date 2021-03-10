const express = require("express");
const routerGC = new express.Router();
const GroupChat = require('../models/groupChatting');
const Authentication = require('./middleware/authentication');
const UserData = require('../models/auth');

routerGC.get('/creategroup', Authentication, async (req, res) => {
    const {myid, fullname} = req.user, {groupName} = req.query;
    console.log(req.query);
    const newGroup = GroupChat({
        groupName: groupName,
        Admin: JSON.stringify([fullname, myid]),
    });
    const result = await newGroup.save();
    const result1 = await UserData.updateOne({_id: myid}, {
        $push: {
            groups: JSON.stringify([result._id, groupName])
        }
    }, { useFindAndModify: false });
    res.send({addit: [result._id, groupName]});
})

routerGC.get('/groupreq', Authentication, async(req, res) => {
    const {myid, fullname} = req.user, {groupid} = req.query;
    const result = await GroupChat.updateOne({id: groupid}, {
        $push: {
            requests: JSON.stringify([myid, fullname])
        }
    }, { useFindAndModify: false });
    res.send({});
})


routerGC.get('/addmember', Authentication, async(req, res) => {
    const {myid, fullname} = req.user;
    const {groupid, friendid, name, groupName} = req.body;
    const result = await GroupChat.updateOne({_id: groupid}, {
        $pull: {
            requests: JSON.stringify([friendid, name])
        }
    }, { useFindAndModify: false });
    const result1 = await GroupChat.updateOne({_id: groupid}, {
        $push: {
            members: JSON.stringify([friendid, name])
        }
    }, { useFindAndModify: false });
    const result2 = await UserData.updateOne({_id: friendid}, {
        $push: {
            groupid: JSON.stringify([groupid, groupName])
        }
    }, { useFindAndModify: false });
    res.send({}); 
})

routerGC.get('/groupquery/:groupid', Authentication, async(req, res) => {
    const result = await GroupChat.findById(req.params.groupid);
    res.send({result: result})
});

routerGC.get('quitgroup', Authentication, async (req, res) => {
    const {myid, fullname} = req.user, {groupid, groupNmae} = req.query;
    const result = await GroupChat.updateOne({_id: groupid}, {
        $pull: {
            members: JSON.stringify([myid, fullname])
        }
    });
    const result1 = await UserData.updateOne({_id: myid}, {
        $pull: {
            groups: JSON.stringify([groupid, groupNmae])
        }
    });
    res.send({});
})

module.exports = routerGC; 