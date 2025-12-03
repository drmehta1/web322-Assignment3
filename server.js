// --- Vercel Fix for require("pg") in ES modules ---
import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("pg"); // professor requirement + Vercel compatibility

// --- Environment ---
import dotenv from "dotenv";
dotenv.config();

// --- Imports (ESM) ---
import express from "express";
import clientSessions from "client-sessions";
import { connectMongo } from "./config/mongo.js";
import { sequelize } from "./config/postgres.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

// --- Connect Databases ---
connectMongo();

sequelize
  .authenticate()
  .then(() => console.log("🐘 PostgreSQL Connected"))
  .catch((err) => console.error("PostgreSQL Error:", err));

sequelize.sync();

// --- Express Setup ---
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  clientSessions({
    cookieName: "session",
    secret: process.env.SESSION_SECRET,
    duration: 24 * 60 * 60 * 1000,
  })
);

app.set("view engine", "ejs");
app.set("views", "./views");


// --- Routes ---
app.get("/", (req, res) => res.redirect("/login"));
app.use("/", authRoutes);
app.use("/", taskRoutes);

// --- Vercel Export ---
export default app;
