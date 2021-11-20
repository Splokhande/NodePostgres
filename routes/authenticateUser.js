const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db");
const { password } = require("../db_config/config");
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../routes/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const {secret} =  require('../db_config/config');

const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const verified = jwt.verify(token, secret);
        console.log(verified.post);
        if(verified.post === "superadmin"){
            req.user = verified;
            next();
        }
        else {
            res.status(400).json( success(
                "Unauthorised access",
                "",
                res.statusCode));
           
        }
        // jwt.verify(token, secret, (err, user) => {
        //     if (err) {
        //         console.log(err);
        //         return res.sendStatus(403);
        //     }
        //     console.log(user);
        //     req.user = user;
        //     next();
        // });
    } 
    else {
        res.status(400).json(
            success(
                "Unauthorised access",
                "",
                res.statusCode));
       
    }
};

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        const verified = jwt.verify(token, secret);
        console.log(verified);
        if(verified){
            req.user = verified;
            next();
        }
        // jwt.verify(token, secret, (err, user) => {
        //     if (err) {
        //         console.log(err);
        //         return res.sendStatus(403);
        //     }
        //     console.log(user);
        //     req.user = user;
        //     next();
        // });
    } 
    else {
        res.status(400).json({
            "message": "Unauthorized User"});;
       
    }
};

module.exports = {authenticateAdmin,authenticateUser};