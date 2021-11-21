const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db");
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const {secret} =  require('../db_config/config');

const { success, error, validation } = require("../functions/response");

const authenticateJWT = async(req, res, next) =>  {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
        const token = authHeader;
        console.log(authHeader);
        jwt.verify(token, secret, async(err, user) => {
            console.log(token);
           
            console.log(user);
            const reqUser = user;
            console.log(reqUser.post);
            if (err) {
               console.log(err);
               return res.sendStatus(403);
           }
           if(reqUser.post === "superadmin"){
               req.user = reqUser;
               next();
           }else{
               res.json( success(
                "Unauthorised access",
                "",
                res.statusCode));
           }
            // console.log(user);
            

        });
    } else {
        res.json(success(
            "Unauthorised access",
            "",
            res.statusCode));;
    }
};

module.exports = authenticateJWT;