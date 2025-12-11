const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  

const Student = sequelize.define('students', {
  name: { type: DataTypes.STRING, allowNull: false },
  last_name: DataTypes.STRING,
  fname: { type: DataTypes.STRING, allowNull: false },
  gfname: { type: DataTypes.STRING, allowNull: false },
  baseno: { type: DataTypes.STRING, allowNull: true },
  birth: { type: DataTypes.STRING, allowNull: false },
  gender: DataTypes.STRING,
  idcard_no: { type: DataTypes.STRING, allowNull: false },
  native_language: DataTypes.STRING,
  mean_location: DataTypes.STRING,
  current_location: { type: DataTypes.STRING, allowNull: false },
  phone1: { type: DataTypes.STRING, allowNull: false },
  phone2: DataTypes.STRING,
  relatives: DataTypes.STRING,
  relatives_name: DataTypes.STRING,
  picture: DataTypes.STRING,
  current_class: DataTypes.STRING,
  entry_way: DataTypes.STRING,
  attachment: DataTypes.STRING,
  yearly_fee: DataTypes.INTEGER,
  transport_fee: DataTypes.INTEGER,
  q_o_month: DataTypes.INTEGER,
  free:DataTypes.STRING,
  attachment2: DataTypes.STRING,
  attachment3:DataTypes.STRING,
}, {
  tableName: 'students',
  freezeTableName: true,
  timestamps: true,
});

module.exports = Student;
