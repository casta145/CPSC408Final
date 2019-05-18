var mysql = require('mysql');
//this function allows us to reuse our connection to the database
function getConnection() {
  return mysql.createConnection({
    host     : '35.233.130.214',
    database : 'maxxhaul',
    user     : 'ramir266',
    password : 'torNado911!',
  })
}

module.exports = getConnection();
