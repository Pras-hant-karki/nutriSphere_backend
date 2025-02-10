const { DataTypes } = require("sequelize");
const sequelize = require("../database/Nutrisphere");

// Define the FitnessPost model
const FitnessPost = sequelize.define(
    'FitnessPost',
    {
      fp_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date_posted: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'fitness_posts',
      timestamps: false,
    }
  );
  
  module.exports = FitnessPost;