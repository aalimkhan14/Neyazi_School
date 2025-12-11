const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  

const Fee = sequelize.define('fees', {
    sid: {type: DataTypes.INTEGER, allowNull: false},
    name:{type: DataTypes.STRING, allowNull: false},
    fname: {type: DataTypes.STRING, allowNull: false},
    month: {type: DataTypes.STRING,allowNull:false},
    fclass:{type: DataTypes.STRING,allowNull: false},
    f_payable: {type: DataTypes.INTEGER, allowNull: false},
    f_payed: {type:DataTypes.INTEGER, allowNull: false},
    t_payable: {type:DataTypes.INTEGER, allowNull: false},
    t_payed: {type:DataTypes.INTEGER},
    r_f: {type:DataTypes.INTEGER},
    r_t: {type:DataTypes.INTEGER},
    rdate: {type:DataTypes.STRING},
    academicYear: {type:DataTypes.STRING}
},{
    tableName: 'fees',
    freezeTableName: true,
    timestamps: true
});

module.exports = Fee