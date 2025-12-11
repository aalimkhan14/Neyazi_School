const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Transport = sequelize.define('transport',{
    name:{type:DataTypes.STRING, allowNull: false},
    plate:{type:DataTypes.STRING, allowNull: false},
    company:{type:DataTypes.STRING, allowNull: false},
    driver:{type:DataTypes.STRING, allowNull: false},
    
},{
    tableName: 'transports',
    freezeTableName: true,
    timestamps: true
});

module.exports = Transport;