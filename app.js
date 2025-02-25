require("dotenv").config();
const express = require("express");
const user_routes = require("./routes/user-routes");
const posts_routes = require("./routes/post-routes");
const appointment_routes = require("./routes/appointment-routes");
const sequelize = require("./database/database");


const cors = require("cors");
const { verifyUser } = require("./middlewares/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/users", user_routes);
app.use("/posts", verifyUser, posts_routes);
app.use("/appointment", appointment_routes);


sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to PostgreSQL database server");

    // Sync models with the database
    return sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables
  })
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Unable to connect or sync with the PostgreSQL database:", err);
  });

// Error handling middleware

app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError" || err.name === "CastError") {
    res.status(400).json({ error: err.message });
  } else if (err.message === "File format not supported.") {
    res.status(400).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Unknown Path
app.use((req, res) => {
  res.status(404).json({ error: "Path Not Found" });
});

module.exports = app;
