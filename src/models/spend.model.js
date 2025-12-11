const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Spend = sequelize.define('spend',{
    details:{type:DataTypes.STRING, allowNull: false},
    quantity:{type:DataTypes.STRING, allowNull: false},
    price:{type:DataTypes.STRING, allowNull: false},
    
},{
    tableName: 'spends',
    freezeTableName: true,
    timestamps: true
});

module.exports = Spend;