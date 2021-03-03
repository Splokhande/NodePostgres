const express = require('express');
const bodyParser = require('body-parser');
const {Pool} = require('pg');
const jwt = require('jsonwebtoken');

const {user, host, database, password, port}= require('./db_config/config.js');
const pool = new Pool({user, host, database, password, port});
// const pool = require("./db");
const userDetail = require("./routes/user");
const auth = require("./routes/auth");
const address = require("./routes/address");
const app = express();
app.use((err,req,res,next) =>{
        res.json(err);
    });
    
app.use(bodyParser.json());
app.use("/user", userDetail);
app.use("/auth", auth);
app.use('/address',)
// 
const ports = 3000;
app.listen(ports,()=> console.log(`listen on port ${ports}`));
module.exports = app;