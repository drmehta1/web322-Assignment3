import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

export const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  dueDate: DataTypes.DATE,
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending"
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
