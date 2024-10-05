const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "sovasobaka1",
  host: "localhost",
  port: 5432,
  database: "cooking_helper",
});

module.exports = pool;
