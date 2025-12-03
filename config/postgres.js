const { Sequelize } = require("sequelize");

let sequelize;

async function connectPostgres() {
  if (!sequelize) {
    sequelize = new Sequelize(
      process.env.PG_DATABASE,
      process.env.PG_USER,
      process.env.PG_PASSWORD,
      {
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        dialect: "postgres",
        logging: false,
        dialectOptions: {
          ssl: { require: true, rejectUnauthorized: false }
        }
      }
    );
  }

  await sequelize.authenticate();
  console.log("🐘 Postgres connected");

  return sequelize;
}

module.exports = { sequelize, connectPostgres };
