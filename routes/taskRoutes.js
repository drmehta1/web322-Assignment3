const express = require("express");
const router = express.Router();
const { Task } = require("../models/Task.js");
const { requireLogin } = require("../middleware/authMiddleware.js");

// Dashboard
router.get("/dashboard", requireLogin, async (req, res) => {
  const tasks = await Task.findAll({ where: { userId: req.session.user.id } });

  res.render("dashboard", {
    user: req.session.user,
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    completed: tasks.filter(t => t.status === "completed").length,
  });
});

// All tasks
router.get("/tasks", requireLogin, async (req, res) => {
  const tasks = await Task.findAll({ where: { userId: req.session.user.id } });
  res.render("tasks", { tasks });
});

// Add Task (form)
router.get("/tasks/add", requireLogin, (req, res) => {
  res.render("addTask");
});

// Add Task (submit)
router.post("/tasks/add", requireLogin, async (req, res) => {
  const { title, description, dueDate } = req.body;

  await Task.create({
    title,
    description,
    dueDate,
    status: "pending",
    userId: req.session.user.id,
  });

  res.redirect("/tasks");
});

// Edit Task
router.get("/tasks/edit/:id", requireLogin, async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  res.render("editTask", { task });
});

// Save Edited Task
router.post("/tasks/edit/:id", requireLogin, async (req, res) => {
  const { title, description, dueDate, status } = req.body;

  await Task.update(
    { title, description, dueDate, status },
    { where: { id: req.params.id } }
  );

  res.redirect("/tasks");
});

// Delete Task
router.post("/tasks/delete/:id", requireLogin, async (req, res) => {
  await Task.destroy({ where: { id: req.params.id } });
  res.redirect("/tasks");
});

module.exports = router;
