const {datatypes} = require('sequelize');
const sequelize = require('../database/Nutrisphere');
const Test = sequelize.define('Test',{
    id: {
    type: DataTypes.INTEGER,
    primarykey: true,
    autoIncrement: true,
    },

    name: {
        type:DataTypes.STRING,
        allowNull: false,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
})
module.exports = Test;