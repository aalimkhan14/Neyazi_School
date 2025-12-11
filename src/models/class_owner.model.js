const {DataTypes} = require('sequelize')
const sequelize = require("../config/db")

const ClassOwner = sequelize.define('class_owner',{
    teacher:{type: DataTypes.STRING, allowNull: false},
    classe:{type: DataTypes.STRING, allowNull: false}
},{
    tableName:'class_owner',
    freezeTableName: true,
    timestamps: true
});

module.exports = ClassOwner;