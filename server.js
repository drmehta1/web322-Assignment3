import { createRequire } from "module";
const require = createRequire(import.meta.url);

// professor requirement
require("pg");

// ESM imports
import express from "express";
import session from "client-sessions";
import mongoose from "mongoose";
import { sequelize } from "./config/postgres.js";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    cookieName: "session",
    secret: process.env.SESSION_SECRET,
    duration: 24 * 60 * 60 * 1000,
  })
);

// Routes
app.use("/", authRoutes);
app.use("/", taskRoutes);

// View engine
app.set("view engine", "ejs");

// Root
app.get("/", (req, res) => res.redirect("/login"));

// DB connect + Start
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo Connected");

    await sequelize.authenticate();
    await sequelize.sync();
    console.log("PostgreSQL Connected");

    if (!process.env.VERCEL) {
      app.listen(process.env.PORT || 8080, () =>
        console.log("Server running on port", process.env.PORT)
      );
    }
  } catch (err) {
    console.error(err);
  }
}

start();

export default app;
