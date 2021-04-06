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
const society = require("./routes/society");
const app = express();
app.use((err,req,res,next) =>{
        res.json(err);
    });
app.get("/",(req,res)=>{
    res.send("Hello World");
});
app.use(bodyParser.json());
app.use("/user", userDetail);
app.use("/auth", auth);
app.use('/address',address);
app.use('/society',society);
// 
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });