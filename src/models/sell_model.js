const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Sell = sequelize.define('sell',{
    customer:{type:DataTypes.STRING, allowNull:false},
    catagory:{type:DataTypes.STRING, allowNull:false},
    goods:{type:DataTypes.STRING, allowNull:false},
    price:{type:DataTypes.STRING, allowNull:false},
    quantity:{type:DataTypes.STRING, allowNull:false},
    barcode:{type:DataTypes.STRING},
},{
    tableName: 'sells',
    freezeTableName: true,
    timestamps: true
});

module.exports = Sell;