const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/postgres");

const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  dueDate: DataTypes.DATE,
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Task;
