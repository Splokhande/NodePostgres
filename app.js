const express = require('express');
const bodyParser = require('body-parser');
const {Pool} = require('pg');
const jwt = require('./helpers/jwt');
const {user, host, database, password, port}= require('./db_config/config.js');
const pool = new Pool({user, host, database, password, port});
// const pool = require("./db");
const userDetail = require("./routes/user");
const auth = require("./routes/auth");
const address = require("./routes/address");
const society = require("./routes/society");
const room = require("./routes/room");
const societyBody = require("./routes/societyBody");
const app = express();
const { handleError } = require("./functions/errorHandling");
const checkAuth = require('./routes/authenticateUser');
// app.use(jwt());
app.use((err,req,res,next) =>{res.json(err);});
app.get("/",(req,res)=>{
    res.send("Hello World"); 
});
app.use(bodyParser.json());
app.use("/user",checkAuth, userDetail);
app.use("/auth", auth);
app.use('/address',address);
app.use('/society',checkAuth,society);
app.use('/room',checkAuth,room);
app.use('/societyBody',checkAuth,societyBody);

app.use((err, req, res, next) => {
    handleError(err, res);
  });

//
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });