const mysql = require("mysql");

const db_config = {
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
};


 const pool = mysql.createPool(db_config); 



module.exports = pool;
