const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db");
const {authenticateAdmin,authenticateUser} = require('./authenticateUser');
const { ErrorHandler } = require("../functions/errorHandling");
const multer = require("multer");
const dStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname);
  },
});

const { success, error, validation } = require("../functions/response");

const upload = multer({ storage: dStorage }).single("file");
const imageUpload = require('../functions/uploadPhoto');

router.post('/imgUpload',upload,imageUpload);

module.exports = router;