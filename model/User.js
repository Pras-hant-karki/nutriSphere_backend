// models/User.js
const { DataTypes } = require('sequelize');
const sequelize=require('../database/database')
const bcrypt = require('bcryptjs');


const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, Infinity]
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'), // ENUM to differentiate roles
      allowNull: false,
      defaultValue: 'user' // Default role is 'user'
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    }
  }, {
    // Model options
    timestamps: true,
    
    // Instance methods
    instanceMethods: {
      toJSON() {
        const values = { ...this.get() };
        delete values.__v;
        values.id = values.id.toString();
        return values;
      }
    }
  });

  // Define associations
User.associate = (models) => {
    User.hasMany(models.ExchangeRequest, {
      foreignKey: 'requesterId',
      as: 'exchangedRequests'
    });
    
    User.belongsToMany(models.Book, {
      through: 'UserBookmarks',
      as: 'bookmarkedBooks'
    });
  };

module.exports = User;
