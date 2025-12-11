const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Employee = sequelize.define('employee',{
    name:{type: DataTypes.STRING, allowNull: false},
    lname:{type: DataTypes.STRING},
    fname:{type: DataTypes.STRING, allowNull: false},
    gfname:{type: DataTypes.STRING, allowNull: false},
    birth:{type: DataTypes.STRING, allowNull: false},
    idcard:{type: DataTypes.STRING, allowNull: false},
    phone:{type: DataTypes.STRING, allowNull: false},
    address:{type: DataTypes.STRING, allowNull: false},
    job:{type: DataTypes.STRING, allowNull: false},
    salary:{type: DataTypes.STRING, allowNull: false},
},{
  tableName: 'employees',
  freezeTableName: true,
  timestamps: true,
});

module.exports = Employee;