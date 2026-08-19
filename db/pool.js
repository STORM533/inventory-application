const dotenv = require("dotenv");
const { Pool } = require("pg");
dotenv.config();
module.exports = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});
