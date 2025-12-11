const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  

const ClassRegistration = sequelize.define('class_registration', {
    classlevel:{type: DataTypes.STRING, allowNull: false},
    classmodify:{type: DataTypes.STRING, allowNull: false},
    classtime:{ type: DataTypes.STRING, allowNull: false},
    order_no:{type:DataTypes.INTEGER, allowNull: false}
},{
    tableName: 'class_registration',
    freezeTableName: true,
    timestamps: true
});

module.exports = ClassRegistration;