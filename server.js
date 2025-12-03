/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: ___Dhairya Rakeshkumar Mehta___________________ Student ID: _170367239_____________ Date: ________3rd December 2025______
*
********************************************************************************/

require("dotenv").config();
require("pg"); // required for vercel

const express = require("express");
const session = require("client-sessions");
const path = require("path");

const connectMongo = require("./config/mongo");
const { sequelize, connectPostgres } = require("./config/postgres");

const ensureLogin = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

/* --------------------------- VIEW ENGINE --------------------------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* --------------------------- STATIC + BODY PARSER --------------------------- */
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

/* --------------------------- SESSION --------------------------- */
app.use(
  session({
    cookieName: "session",
    secret: process.env.SESSION_SECRET || "supersecret",
    duration: 24 * 60 * 60 * 1000,
  })
);

/* --------------------------- VERCEL FRIENDLY DB INIT --------------------------- */

let dbConnected = false;

async function ensureDatabases() {
  if (dbConnected) return;

  try {
    console.log("🔄 Initializing database connections...");
    await connectMongo();
    await connectPostgres();
    await sequelize.sync();
    console.log("✅ All databases connected successfully.");
    dbConnected = true;
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
}

app.use(async (req, res, next) => {
  await ensureDatabases();
  next();
});

/* --------------------------- ROUTES --------------------------- */
app.get("/", (req, res) => res.redirect("/login"));

app.use("/", authRoutes);
app.use("/", ensureLogin, taskRoutes);

/* --------------------------- 404 PAGE --------------------------- */
app.use((req, res) => {
  res.status(404).render("404", { message: "Page Not Found" });
});

/* --------------------------- EXPORT FOR VERCEL --------------------------- */
module.exports = app;
