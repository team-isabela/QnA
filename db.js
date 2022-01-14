const postgres = require('postgres');

const sql = postgres({
  database: 'qna',
  user: 'dev',
  password: ''
});

module.exports = sql