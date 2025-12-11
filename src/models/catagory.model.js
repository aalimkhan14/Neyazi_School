const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Catagory = sequelize.define('catagory',{
    name:{type:DataTypes.STRING, allowNull: false},
},{
    tableName: 'catagorys',
    freezeTableName: true,
    timestamps: true
});

module.exports = Catagory;