const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Teacher = sequelize.define('teacher',{
    name:{type: DataTypes.STRING, allowNull: false},
    lname:{type: DataTypes.STRING},
    fname:{type: DataTypes.STRING, allowNull: false},
    gfname:{type: DataTypes.STRING, allowNull: false},
    birth:{type: DataTypes.STRING, allowNull: false},
    idcard:{type: DataTypes.STRING, allowNull: false},
    phone:{type: DataTypes.STRING, allowNull: false},
    address:{type: DataTypes.STRING, allowNull: false},
    educatelevel:{type: DataTypes.STRING},
    educateunit:{type: DataTypes.STRING},
    graduatedate:{type: DataTypes.STRING},
    graduateplace:{type: DataTypes.STRING},
    job:{type: DataTypes.STRING, allowNull: false},
    salary:{type: DataTypes.STRING, allowNull: false},
    formcode:{type: DataTypes.STRING, allowNull:false},
    agreement:{type: DataTypes.STRING, allowNull: true}
},{
  tableName: 'teachers',
  freezeTableName: true,
  timestamps: true,
});

module.exports = Teacher;