// Requiring firebase (as our db)
const firebase = require('firebase-admin');
// Importing our configuration to initialize our app
const {firebaseConfig} = require('../db_config/firebase_config');
const serviceAccount = require('../firebase_server_key.json');
// Creates and initializes a Firebase app instance. Pass options as param
// const db = firebase.initializeApp(firebaseConfig);
// firebase.initializeApp({
//     credential: firebase.credential.cert(serviceAccount),
//     storageBucket:"gs://societymanagement-a0f1e.appspot.com",
//     databaseURL: "societymanagement-a0f1e.firebaseapp.com"
//   });

// module.exports = db;