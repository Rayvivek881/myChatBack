const express = require("express");
const app = express();
const mongoose = require('mongoose');
const UserData = require('../models/auth')
const Post = require('../models/Post')
const routerLS = require('./routerls')
const routerGC = require('./routergc')
const routerFriend = require('./rourterfriend');
const routersearch = require('./routerSearch')
const routerPost = require('./routerpost')
const cookieParser = require('cookie-parser');
const {MONGOURI} = require('./keys.js');
const port = process.env.PORT || 8000;


mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {console.log('Connection successful..........');})
    .catch((err) => console.log(err));

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(routerLS);
app.use(routerFriend);
app.use(routersearch);
app.use(routerPost);
app.use(routerGC);

app.listen(port, () => { 
    console.log(`we are working port ${port}`);
});