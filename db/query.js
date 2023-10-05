var Pool = require('pg').Pool;
var pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'moviesdatabase',
  password: 'mukti',
  port: 5432,
});

module.exports = pool