const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

async function connectPostgres() {
  try {
    await sequelize.authenticate();
    console.log("🐘 PostgreSQL Connected");
  } catch (err) {
    console.error("PostgreSQL Error:", err);
  }
}

module.exports = { sequelize, connectPostgres };
