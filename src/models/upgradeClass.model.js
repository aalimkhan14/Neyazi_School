const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UpgradeClass = sequelize.define('upgradeClass', {
    sid: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    fname: { type: DataTypes.STRING, allowNull: false },
    fee: { type: DataTypes.STRING, allowNull: false },
    classs: { type: DataTypes.STRING, allowNull: false },
    academicYear: { type: DataTypes.STRING, allowNull: false },
    q_o_month: { type: DataTypes.STRING, allowNull: false } // <-- added field
}, {
    tableName: 'upgradeClasses',
    freezeTableName: true,
    timestamps: true
});

module.exports = UpgradeClass;
