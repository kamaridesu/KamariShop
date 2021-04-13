const postgres = require("postgres");
const dotenv = require("dotenv").config();

const sql = postgres();

const connectDB = async (callback) => {
  try {
    await sql`SELECT 2+2`;
    console.log("connected to database");
    callback();
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  sql,
  connectDB,
};
