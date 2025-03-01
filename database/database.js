const { Sequelize } = require("sequelize");

const dbName = process.env.NODE_ENV === "test" ? "prashant_test" : "prashant";

const sequelize = new Sequelize(dbName, "postgres", "admin123", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  logging: false,
});

module.exports = sequelize;