/********************************************************************************
* WEB322 – Assignment 03
*
* Vercel Compatible Server.js
********************************************************************************/

require("dotenv").config();
require("pg"); // forces Vercel to bundle pg

const express = require("express");
const path = require("path");
const session = require("client-sessions");

// DB
const connectMongo = require("./config/mongo");
const { sequelize, connectPostgres } = require("./config/postgres");

// Routes & Middleware
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const ensureLogin = require("./middleware/authMiddleware");

const app = express();

/* ------------------------------
   VIEW ENGINE
------------------------------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ------------------------------
   STATIC FILES
------------------------------- */
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

/* ------------------------------
   SESSION
------------------------------- */
app.use(
  session({
    cookieName: "session",
    secret: process.env.SESSION_SECRET || "supersecret",
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  })
);

/* ------------------------------
   LAZY DB CONNECTION (VERCEL SAFE)
------------------------------- */
let dbReady = false;

async function ensureDatabases() {
  if (dbReady) return;

  try {
    console.log("🔄 Connecting databases...");
    await connectMongo();
    await connectPostgres();
    await sequelize.sync();
    console.log("✅ Databases ready!");
    dbReady = true;
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
}

app.use(async (req, res, next) => {
  await ensureDatabases();
  next();
});

/* ------------------------------
   ROUTES
------------------------------- */
app.get("/", (req, res) => res.redirect("/login"));

app.use("/", authRoutes);          // no login
app.use("/", ensureLogin);         // everything after requires login
app.use("/", taskRoutes);

/* ------------------------------
   404
------------------------------- */
app.use((req, res) => {
  res.status(404).render("404", { message: "Page not found" });
});

/* ------------------------------
   EXPORT (NO LISTEN ON VERCEL)
------------------------------- */
module.exports = app;
