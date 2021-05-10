const {Pool} = require('pg');
const {user, host, database, password, port, ssl}= require('../db_config/config.js');
const {Connecti}  = require('databases/pg');
 const connect = Connecti('postgres://YourUserName:ownumxfkwgkmyt@ec2-54-235-108-217.compute-1.amazonaws.com:5432/ddgphpmj7ue7b4');
const pool = new Pool({user, host, database, password, port,ssl:ssl});
// const pool = new Pool({user, host, database, password, port});

module.exports = {pool, connect};