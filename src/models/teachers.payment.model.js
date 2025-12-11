const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  

const TeacherPayment = sequelize.define('teacher_payment', {
    tpid: {type:DataTypes.STRING},
    month: {type:DataTypes.STRING},
    name: {type:DataTypes.STRING},
    payablea: {type:DataTypes.INTEGER},
    payeda:{type:DataTypes.INTEGER, allowNull: false},
    r_p: {type: DataTypes.INTEGER},
    pdate: {type: DataTypes.STRING}
},{
    tableName: 'teacher_payments',
    freezeTableName: true,
    timestamps: true
});

module.exports = TeacherPayment