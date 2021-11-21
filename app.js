const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const { Storage } = require("@google-cloud/storage");
const admin = require("firebase-admin");

const serviceAccount = require("./firebase_server_key.json");admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://societymanagement-a0f1e.appspot.com",
  databaseURL: "societymanagement-a0f1e.firebaseapp.com",
});

const app = new express();
const path = require("path");
const jwt = require("./helpers/jwt");
const {
  user,
  host,
  database,
  password,
  port,
} = require("./db_config/config.js");
const pool = new Pool({ user, host, database, password, port });
// const pool = require("./db");
const { v4: uuidv4 } = require("uuid");
uuidv4();
const userDetail = require("./routes/user");
const adminDetail = require("./routes/admin/admin");
const auth = require("./routes/auth");
const address = require("./routes/address");
const society = require("./routes/society");
const room = require("./routes/room");
const uploadPhoto = require("./routes/uploadPhoto");
const societyBody = require("./routes/societyBody");
// const app = express();
const { handleError, handleResponse } = require("./functions/errorHandling");
const {
  authenticateAdmin,
  authenticateUser,
} = require("./routes/authenticateUser");
const multer = require("multer");
const dStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null,new Date().toISOString()+file.originalname);
  },
});

const upload = multer({ storage: dStorage }).single("file");
const imgUpload = require("./functions/uploadPhoto");
// app.use(jwt());
// app.use((err,req,res,next) =>{
//   res.json(err);});
// app.use((req, res) => {
//   handleResponse(res);
// });

app.get("/", (req, res) => {
  res.send("Hello World");
});



app.use(bodyParser.json());
app.use("/user", userDetail);
app.use("/admin", authenticateAdmin, adminDetail);
app.use("/auth", auth);
app.use("/address", address);
app.use("/society", authenticateUser, society);
app.use("/room", authenticateUser, room);
app.use("/societyBody", authenticateUser, societyBody);
app.use("/img", authenticateUser, uploadPhoto);
app.use((err, req, res, next) => {
  handleError(err, res);
});

//
app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
