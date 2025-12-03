import { createRequire } from "module";
const require = createRequire(import.meta.url);

// professor requirement
require("pg");

import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    }
  }
);
