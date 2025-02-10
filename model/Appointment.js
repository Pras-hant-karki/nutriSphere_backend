const { DataTypes } = require('sequelize');
const sequelize = require('../database/Nutrisphere');

// Define the Appointment model
const Appointment = sequelize.define(
    'Appointment',
    {
      app_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      app_status: {
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
      tableName: 'appointments',
      timestamps: false,
    }
  );
  
  module.exports = Appointment;