const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const User=require('../models/User')


const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Referencing the User model
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending'
    },
    requestedDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: true
});
// Define the belongsTo relationship with a custom alias

Appointment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Appointment;
