const mysql = require("mysql2");

const poll = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete",
});

module.exports = poll.promise();
