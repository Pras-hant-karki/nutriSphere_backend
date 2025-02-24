// models/Post.js
const  DataTypes  = require('sequelize');
const sequelize=require('../database/database')


const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    postCover: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true
  });



module.exports = Post;
