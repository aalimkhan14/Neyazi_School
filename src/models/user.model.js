// models/User.js
const DataTypes = require ("sequelize");
const sequelize = require ("../config/db"); // your Sequelize instance
const bcrypt = require ("bcrypt");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,},
  username: {type: DataTypes.STRING, allowNull: false,},
  password: {type: DataTypes.STRING, allowNull: false, },
  email: {type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true },},
  role: { type: DataTypes.STRING, allowNull: false,},
  resetToken: {type: DataTypes.STRING, allowNull: true, },
  resetTokenExpiry: { type: DataTypes.DATE, allowNull: true,},
}, {
  tableName: "users",
  timestamps: true,
});

module.exports = User;
