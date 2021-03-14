const express = require("express");
const routerLS = new express.Router();
const UserData = require('../models/auth');
const isOkEmail = require('./middleware/Emailvarification');
const bcrypt = require('bcryptjs');
const tokenobj = require('./middleware/jwt');
const Authentication = require('./middleware/authentication');
const Post = require("../models/Post");
const Cryption = require('./middleware/encryption');

routerLS.post('/signup', async(req, res) =>{
    console.log(req.body);
    const {fullname, username, email, password ,cpassword} = req.body;
    if (password != cpassword) {
        res.send({isVarified: false, massage: `both passward didn't match`});
        return;
    }
    const first = await UserData.findOne({$or:[{username: username}, {email: Cryption.Encryption(email)}]}).select({__id: true});
    if (first != null) {
        res.send({isVarified: false, massage: `email and username is not unique`});
        console.log('geting.....');
        return;
    }
    if (username.indexOf('@') != -1) {
        res.send({isVarified: false, massage: `usename can only contain alphanumeric values`});
        return;
    }
    let val = await isOkEmail(email, fullname);
    res.send({isVarified: true, val: val, massage: `email varification OTP`});
});

routerLS.patch('/signup', async(req, res) =>{
    const {fullname, image, username, email, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 12);
    const newData = new UserData({
        fullname: fullname,
        image: image,
        username: username,
        email: Cryption.Encryption(email),
        password: hashedpassword,
    });
    const result = await newData.save();
    console.log('Account Created');
    res.send({massage: 'account created'});
});

routerLS.post('/login', async(req, res) =>{
    const {username, password} = req.body;
    const result = await UserData.findOne({username: username});
    if(result == null) {
        res.send({isVarified: false, massage: 'username not exist please check username'});
    } else if (!await bcrypt.compare(password, result.password)) {
        res.send({isVarified: false, massage: 'password is not correct please forget password'});
    } else {
        const token = await tokenobj.CreateToken(result._id, result.fullname);
        let options = {
            maxAge: 1000 * 60 * 120,
            httpOnly: true,
        }
        res.cookie('user_id', token , options)
        res.send({isVarified: true, massage: 'found', data: result});
    }
});

routerLS.get('/logout', (req, res) => {
    let options = {
        maxAge: 10,
        httpOnly: true,
    }
    res.cookie('user_id', '' , options)
    res.send({done: true});
})

routerLS.post('/forgetpass', async (req, res) =>{
    const { emailorusername } = req.body;
    console.log(req.body);
    let result, flag;
    if (emailorusername.indexOf('@') != -1) {
        result = await UserData.findOne({email: Cryption.Encryption(emailorusername)}).select({email: true, fullname: true});
        flag = true
    } else {
        result = await UserData.findOne({username: emailorusername}).select({email: true, fullname: true});
        flag = false;
    }
    if (result == null) {
        res.send({isVarified: false, massage:'user with this email or username not exist please check again'});
    } else {
        const {email, fullname} = result;
        let val = await isOkEmail(Cryption.Decryption(email), fullname);
        res.send({isVarified: true, massage:'proceed further', val: val, isemail: flag});
    }
});

routerLS.patch('/forgetpass', async(req, res) =>{
    const { isemail, password, cpassword, emailorusername } = req.body;
    let result;
    if (password != cpassword) {
        res.send({isVarified: false, massage: `both passward didn't match`});
    }
    const hashedpassword = await bcrypt.hash(password, 12);
    if (isemail) {
        result = await UserData.updateOne({email: Cryption.Encryption(emailorusername)}, {
            $set: {
                password: hashedpassword
            }
        }, { useFindAndModify: false });
    }
    else {
        result = await UserData.updateOne({username: emailorusername}, {
            $set: {
                password: hashedpassword
            }
        }, { useFindAndModify: false });
    }
    res.send({isVarified: true, massage: `you can login with new password`})
})

routerLS.post('/home',Authentication, async(req, res) => {
    const { myid } = req.user;
    const result = await UserData.findById(myid).select({password: false, friendChats: false, email: false});
    const obj = {
        ...result,
        newmessage: result.newmessage.length,
    }
    res.send({isVarified: true, data: obj});
});

routerLS.put('/editprofile', Authentication, async (req, res) => {
    const {myid} = req.user;
    console.log(req.body);
    const {image, status, fullname} = req.body;
    const update = await UserData.updateOne({_id: myid}, {
        $set: {
            image,
            fullname,
            status
        }
    }, { useFindAndModify: false })
    res.send({message: 'your profile has updated'})
})
module.exports = routerLS;