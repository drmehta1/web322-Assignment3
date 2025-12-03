require("dotenv").config();
require("pg");

const { Sequelize } = require("sequelize");

// 🟢 FIX: Explicit fallback + safe URL parsing
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("❌ ERROR: POSTGRES_URL is missing!");
}

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
  logging: false,
});

// For server.js lazy connect
async function connectPostgres() {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected");
  } catch (err) {
    console.error("❌ PostgreSQL FAILED:", err.message);
  }
}

module.exports = { sequelize, connectPostgres };
