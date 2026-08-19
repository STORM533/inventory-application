const dotenv = require("dotenv");
const { Pool } = require("pg");
dontenv.config();
module.exports = new Pool({
  connectionString: process.env.DATABASE_URL,
});
