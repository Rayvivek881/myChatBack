const express = require("express");
const routerGC = new express.Router();
const GroupChat = require('../models/groupChatting');
const Authentication = require('./middleware/authentication');
const UserData = require('../models/auth');

routerGC.get('/creategroup', Authentication, async (req, res) => {
    const {myid, fullname} = req.user, {groupName} = req.query;
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
    });
    res.send({});
})

module.exports = routerGC;