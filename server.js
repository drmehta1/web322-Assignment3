import dotenv from "dotenv";
dotenv.config();  // MUST BE FIRST

import express from "express";
import clientSessions from "client-sessions";
import { connectMongo } from "./config/mongo.js";
import { sequelize } from "./config/postgres.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

// -------------------------------------------------------------
// 1. TEST ENV VARIABLES
// -------------------------------------------------------------
console.log("PG HOST =", process.env.PG_HOST);
console.log("PG USER =", process.env.PG_USER);
console.log("PG DATABASE =", process.env.PG_DATABASE);

// -------------------------------------------------------------
// 2. Connect MongoDB
// -------------------------------------------------------------
connectMongo();

// -------------------------------------------------------------
// 3. Connect PostgreSQL
// -------------------------------------------------------------
sequelize.authenticate()
  .then(() => console.log("🐘 PostgreSQL Connected"))
  .catch(err => console.error("PostgreSQL Error:", err));

sequelize.sync();

// -------------------------------------------------------------
// 4. Setup Express App
// -------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 8080;

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

// -------------------------------------------------------------
// 5. Routes
// -------------------------------------------------------------
app.use("/", authRoutes);
app.use("/", taskRoutes);

// -------------------------------------------------------------
// 6. Start Server
// -------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
