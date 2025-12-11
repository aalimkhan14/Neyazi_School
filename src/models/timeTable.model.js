const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const TimeTable = sequelize.define('timeTable',{
    day:{type:DataTypes.STRING, allowNull: false},
    lessonOrder:{type:DataTypes.STRING, allowNull: false},
    classe:{type:DataTypes.STRING, allowNull: false},
    subjectkind:{type:DataTypes.STRING, allowNull: false},
    subject:{type:DataTypes.STRING, allowNull: false},
    teacher:{type:DataTypes.STRING, allowNull: false},
    startTime:{type:DataTypes.STRING, allowNull: false},
    endTime:{type:DataTypes.STRING, allowNull: false},
},{
    tableName: 'timeTables',
    freezeTableName: true,
    timestamps: true
});

module.exports = TimeTable;