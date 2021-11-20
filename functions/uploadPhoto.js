const { Router, request, response } = require("express");
const router = Router();
const pool = require("../db");
const uuid = require("uuid");
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require("../routes/user");
var Cloud = require("@google-cloud/storage");
const multer = require("multer");
const { Storage } = Cloud;
const firebaseDb = require('../db');
require("firebase/storage");
require("dotenv").config();
const firebaseStorage = firebaseDb.storage;
global.XMLHttpRequest = require("xhr2");
require("firebase/storage");
const { ErrorHandler } = require("../functions/errorHandling");
const { v4: uuidv4 } = require("uuid");
const { success, error, validation } = require("../functions/response");

var serviceAccount = require("../firebase_server_key.json");

// const { firebaseconfig } = require("../db_config/firebase_config");
// app.locals.bucket = admin.storage().bucket();
// const storage = new Storage({
//   projectId: "societymanagement-a0f1e",
//   keyFilename: "../firebase_server_key.json",
// });

const dStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

// const firebase = require('./db/firebasedb');
require("firebase/storage");
const firebaseStore = admin.storage().bucket();
// const upload = multer({ storage: dStorage }).single("file");
// app.post("/imgUpload", upload,);

const uploadImage =  async (req, res, next) => {
  try {
    console.log(req.file);
    console.log(__dirname);
    // console.log(upload);
    const file = req.file;
    // console.log(file);
    const timestamp = Date.now();
    // console.log(file.path);
    // console.log(dStorage.destination(req, req.file));
    const filename = file.originalname;
    const type = file.originalname.split(".")[1];
    const metadata = {
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
      },
      cacheControl: "public, max-age=31536000",
    };

    // Uploads a local file to the bucket
    await firebaseStore.upload(filename, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      metadata: metadata,
    });

    console.log(`${filename} uploaded.`);
    res.send;
  } catch (e) {
    console.log(e);
    new ErrorHandler(400, e.message);
  }
};


module.exports = uploadImage;
