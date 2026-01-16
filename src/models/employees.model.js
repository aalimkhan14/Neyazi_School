const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Employee = sequelize.define('employee',{
    name:{type: DataTypes.STRING, allowNull: false},
    lname:{type: DataTypes.STRING},
    fname:{type: DataTypes.STRING, allowNull: false},
    gfname:{type: DataTypes.STRING, allowNull: false},
    birth:{type: DataTypes.STRING},
    idcard:{type: DataTypes.STRING, allowNull: false},
    phone:{type: DataTypes.STRING, allowNull: false},
    address:{type: DataTypes.STRING},
    job:{type: DataTypes.STRING, allowNull: false},
    salary:{type: DataTypes.STRING, allowNull: false},
    agreement:{type: DataTypes.STRING},
    diplomaLetter:{type: DataTypes.STRING},
    idCardLetter:{type: DataTypes.STRING}
},{
  tableName: 'employees',
  freezeTableName: true,
  timestamps: true,
});

module.exports = Employee;