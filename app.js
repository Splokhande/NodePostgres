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

app.use(jwt());
app.use((err,req,res,next) =>{res.json(err);});
    
app.get("/",(req,res)=>{
    res.send("Hello World"); 
});
app.use(bodyParser.json());
app.use("/user", userDetail);
app.use("/auth", auth);
app.use('/address',address);
app.use('/society',society);
app.use('/room',room);
app.use('/societyBody',societyBody);

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      err = {
        statusCode:400,
        message:"Invalid token"
      }
  }
    handleError(err, res);
  });

// 
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });