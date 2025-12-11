const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  

const EmployeePayment = sequelize.define('employee_payment', {
    epid: {type:DataTypes.STRING},
    month: {type:DataTypes.STRING},
    name: {type:DataTypes.STRING},
    payablea: {type:DataTypes.INTEGER},
    payeda:{type:DataTypes.INTEGER, allowNull: false},
    r_p: {type: DataTypes.INTEGER},
    pdate: {type: DataTypes.STRING}
},{
    tableName: 'employee_payments',
    freezeTableName: true,
    timestamps: true
});

module.exports = EmployeePayment