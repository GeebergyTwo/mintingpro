// db.js
const mysql = require('mysql2');

// Create a pool of connections
const db = mysql.createPool({
  host: 'srv1178.hstgr.io',
  user: 'u564766514_unioncredprime',
  password: 'g3;^[@;rK4',
  database: 'u564766514_unioncredprime',
  waitForConnections: true,
  connectionLimit: 10, // Adjust this number based on your load
  queueLimit: 0
});

// Connect to the database
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
    return;
  }
  if (connection) connection.release(); // Release the connection back to the pool
  console.log('Connected to database');
});
module.exports = db;
