const {Pool} = require('pg');
const {user, host, database, password, port, ssl}= require('../db_config/config.js');

const pool = new Pool({user, host, database, password, port,ssl:ssl});
// const pool = new Pool({user, host, database, password, port});

module.exports = pool;