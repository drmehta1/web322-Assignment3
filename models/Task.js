const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/postgres");

let Task = null;

function getTaskModel() {
  if (!sequelize) {
    console.error("❌ Sequelize not initialized yet");
    return null;
  }

  if (!Task) {
    Task = sequelize.define("Task", {
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
      }
    });
  }

  return Task;
}

module.exports = getTaskModel();
