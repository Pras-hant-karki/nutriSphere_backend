const { DataTypes } = require('sequelize');
const sequelize = require('../database/Nutrisphere');

// Define the Admin model
const Admin = sequelize.define(
  'Admin',
  {
    admin_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    admin_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: 'admins', // Optional: Specify table name
    timestamps: false,  // Disable createdAt/updatedAt if not needed
  }
);

module.exports = Admin;
