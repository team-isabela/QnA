const postgres = require('postgres');

const sql = postgres({
  database: 'qna',
  user: 'dev',
  password: '' //typically needs to be filled in when deployed
});

module.exports = sql