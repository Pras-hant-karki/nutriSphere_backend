const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");

const WorkoutRequest = sequelize.define(
  "WorkoutRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    height: {
      type: DataTypes.FLOAT, // Storing height in cm or meters
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT, // Storing weight in kg
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    goal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed"),
      defaultValue: "pending",
    },
    workoutPlan: {
      type: DataTypes.TEXT,
      allowNull: true, // This will be filled when admin responds
    },
  },
  {
    timestamps: true,
  }
);

module.exports = WorkoutRequest;
