const mysql = require('mysql2');

/* const pool = mysql.createPool({
  user: process.env.DB_USER, // e.g. 'my-db-user'
  password: process.env.DB_PASS, // e.g. 'my-db-password'
  database: process.env.DB_NAME, // e.g. 'my-database'
  socketPath: process.env.INSTANCE_UNIX_SOCKET, // e.g. '/cloudsql/project:region:instance'

});

// [END cloud_sql_mysql_mysql_connect_unix]
pool.query('select * from post').then(data => {
  console.log(data)
}) */

const pool = mysql.createPool({
  user: process.env.DB_USER, // e.g. 'my-db-user'
  password: process.env.DB_PASS, // e.g. 'my-db-password'
  database: process.env.DB_NAME, // e.g. 'my-database'
  socketPath: process.env.INSTANCE_UNIX_SOCKET, // e.g. '/cloudsql/project:region:instance'

});

module.exports = pool.promise();