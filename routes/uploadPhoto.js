const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db");
const {authenticateAdmin,authenticateUser} = require('./authenticateUser');
const { ErrorHandler } = require("../functions/errorHandling");

const { success, error, validation } = require("../functions/response");
const multer = require("multer");
const upload = multer({ storage: dStorage }).single("file");
const imageUpload = require('../functions/uploadPhoto');

router.post('/imgUpload',upload,imageUpload);

module.exports = {router};