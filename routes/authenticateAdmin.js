const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db");
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var jwt = require('jsonwebtoken');

const {secret} =  require('../db_config/config');

const authenticateJWT = async(req, res, next) =>  {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, secret, async(err, user) => {
            console.log(token);
           
            console.log(user);
            const reqUser = user;
            if (err) {
               console.log(err);
               return res.sendStatus(403);
           }
           if(reqUser.post === "superadmin"){
               req.user = reqUser;
               next();
           }else{
               res.json({"message": "Invalid User"});;
           }
            // console.log(user);
            

        });
    } else {
        res.json({"message": "Unauthorized User"});;
    }
};

module.exports = authenticateJWT;