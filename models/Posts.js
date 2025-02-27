// models/Post.js
const DataTypes = require("sequelize");
const sequelize = require("../database/database");
const User = require("../models/User");

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    postCover: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
  }
);

Post.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = Post;
