const { DataTypes } = require("sequelize");
const sequelize = require("../database/Nutrisphere");

// Define the Request model
const Request = sequelize.define(
    'Request',
    {
      req_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: 'pending',
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'requests',
      timestamps: false,
    }
  );
  
  module.exports = Request;