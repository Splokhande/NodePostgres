const express = require('express');
const multer = require('multer');
const uuid = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
       const {originalname} = file;
       cb(null, `${uuid()}-${originalname}`);
    },
});
const upload = multer({storage : storage});