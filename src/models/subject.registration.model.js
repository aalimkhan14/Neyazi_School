const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SubjectRegistration = sequelize.define('subject',{
    name:{type:DataTypes.STRING, allowNull: false},
    catagory:{type:DataTypes.STRING, allowNull: false},
    classselection:{type:DataTypes.STRING, allowNull: false}
},{
    tableName: 'subjects',
    freezeTableName: true,
    timestamps: true
});

module.exports = SubjectRegistration;