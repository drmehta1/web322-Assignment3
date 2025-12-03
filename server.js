/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
********************************************************************************/

require("dotenv").config();
require("pg"); // ensures Vercel bundles pg

const express = require("express");
const session = require("client-sessions");
const path = require("path");

// DB Connections
const connectMongo = require("./config/mongo");
const { sequelize, connectPostgres } = require("./config/postgres");

// Middleware + Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { requireLogin } = require("./middleware/authMiddleware");

const app = express();

/* ---------------------------------------------
   VIEW ENGINE (IMPORTANT FOR VERCEL)
--------------------------------------------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ---------------------------------------------
   STATIC + BODY PARSER
--------------------------------------------- */
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

/* ---------------------------------------------
   SESSION SETTINGS
--------------------------------------------- */
app.use(
  session({
    cookieName: "session",
    secret: process.env.SESSION_SECRET || "supersecret",
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5,
  })
);

/* ---------------------------------------------
   LAZY DATABASE CONNECTION (VERCEL SAFE)
--------------------------------------------- */
let dbConnected = false;

async function ensureDB() {
  if (dbConnected) return;

  try {
    console.log("🔄 Initializing database connections...");

    await connectMongo();      // MongoDB
    await connectPostgres();   // Postgres
    await sequelize.sync();    // Models sync

    console.log("✅ All databases connected.");
    dbConnected = true;
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
}

app.use(async (req, res, next) => {
  await ensureDB();
  next();
});

/* ---------------------------------------------
   ROUTES
--------------------------------------------- */
app.get("/", (req, res) => res.redirect("/login"));

app.use("/", authRoutes);
app.use("/", requireLogin, taskRoutes);

/* ---------------------------------------------
   404 PAGE
--------------------------------------------- */
app.use((req, res) => {
  res.status(404).render("404", { message: "Page not found" });
});

/* ---------------------------------------------
   EXPORT SERVER FOR VERCEL (NO LISTEN)
--------------------------------------------- */
module.exports = app;
