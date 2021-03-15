const express = require("express");
const routersearch = new express.Router();
const UserData = require('../models/auth');
const IsOkName = require('./middleware/editDistance');
const GroupChat = require('../models/groupChatting');

routersearch.post('/search', async (req, res) => {
    const {search} = req.body;
    let data = [];
    const result = await UserData.find().select({fullname: true});
    for (let index = 0; index < result.length; index++) {
        if (IsOkName(search, result[index].fullname)) {
            data.push(result[index]);
        } 
    }
    let data1 = [];
    const result1 = await GroupChat.find().select({groupName: true});
    for (let index = 0; index < result1.length; index++) {
        if (IsOkName(search, result1[index].groupName)) {
            data1.push(result1[index]);
        }
    }
    res.send({matches: data, group: data1});
});

module.exports = routersearch;