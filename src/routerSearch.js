const express = require("express");
const routersearch = new express.Router();
const Authentication = require('./middleware/authentication')
const UserData = require('../models/auth');
const IsOkName = require('./middleware/editDistance')

routersearch.post('/search', async (req, res) => {
    const {search} = req.body;
    let data = [];
    const result = await UserData.find()
        .select({fullname: true});
    for (let index = 0; index < result.length; index++) {
        if (IsOkName(search, result[i].fullname)) {
            data.push(result[i]);
        }
    }
    res.send({matches: data})
});

module.exports = routersearch;