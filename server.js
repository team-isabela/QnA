const express = require('express');
const sql = require('./db.js');

const server = express();
const port = 3000;

server.get('/', (req, res) => {
  res.send('root GET response');
})

server.listen(port, () => {
  console.log(`sdc6 server.js now listening at port ${port}...`)
})