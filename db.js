const postgres = require('postgres');
const {psqlpw} = require('./config.js');

const sql = postgres({
  database: 'qna',
  user: 'dev',
  password:  psqlpw
});

module.exports = sql
