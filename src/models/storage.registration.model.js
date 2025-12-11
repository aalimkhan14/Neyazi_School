const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Storage = sequelize.define('storage',{
    catagory:{type:DataTypes.STRING, allowNull:false},
    name:{type:DataTypes.STRING, allowNull: false},
    quantity:{type:DataTypes.STRING, allowNull:false},
    buyamount:{type:DataTypes.STRING, allowNull:false},
    sellamount:{type:DataTypes.STRING, allowNull:false},
},{
    tableName: 'storages',
    freezeTableName: true,
    timestamps: true
});

module.exports = Storage;