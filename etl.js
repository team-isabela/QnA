const postgres = require('postgres');
const path = require('path');

const sql = postgres({...options});

sql.file(path.join(__dirname, 'postgres-schema.sql'), [], {
  cache: true;
});