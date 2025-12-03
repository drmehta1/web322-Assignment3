const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.get("/register", (req, res) => res.render("register"));

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hashed });

  res.redirect("/login");
});

router.get("/login", (req, res) => res.render("login"));

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.render("login", { error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.render("login", { error: "Invalid password" });

  req.session.user = { id: user._id, username: user.username };
  res.redirect("/dashboard");
});

router.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/login");
});

module.exports = router;
