const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "SandiMySQL24", 
  database: "PerpustakaanDB_PAW",
  port: 3307, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("✅ Database Config Loaded (Port 3307)");

module.exports = db;