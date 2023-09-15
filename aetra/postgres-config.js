const { Pool } = require("pg");

const pool = new Pool({
  host: "db",
  port: 5432,
  user: "aetra",
  password: "password123",
  database: "aetra",
});

module.exports = pool;
