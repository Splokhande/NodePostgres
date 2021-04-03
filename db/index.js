const {Pool} = require('pg');
const {user, host, database, password, port}= require('../db_config/config.js');

const pool = new Pool({user, host, database, password, port,ssl:{ rejectUnauthorized: false }});

module.exports = pool;