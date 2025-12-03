import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// GET REGISTER
router.get("/register", (req, res) => {
  res.render("register");
});

// POST REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await User.create({ username, email, password: hashed });

  res.redirect("/login");
});

// GET LOGIN
router.get("/login", (req, res) => {
  res.render("login");
});

// POST LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.render("login", { error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.render("login", { error: "Invalid password" });

  req.session.user = { id: user._id, username: user.username };
  res.redirect("/dashboard");
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/login");
});

export default router;
