const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db/db_path");
const {authenticateAdmin,authenticateUser} = require('./authenticateUser');
const { ErrorHandler } = require("../functions/errorHandling");
const multer = require("multer");
const dStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null,new Date().toISOString()+file.originalname);
  },
});

const { success, error, validation } = require("../functions/response");

const upload = multer({ storage: dStorage }).single("file");
const imageUpload = require('../functions/uploadPhoto');

router.post('/imgUpload',upload,async(req,response,next)=> {
    // console.log(req);
    const {id, file} = req.body;
    // const filePath = imageUpload(req) ;

    const filePath = imageUpload(req,response) ;
    // console.log(filePath);
    console.log(filePath);
    console.log(id);
    pool.query(`Update users set photo = $1 where id = $2`,[filePath,id],(err,res)=>{
        if(err)
         new ErrorHandler(400,err.message);

         response.json(
             success(
                 "Photo updated successfully",
                 {},
                 200
             )
         );
    });
});

module.exports = router;