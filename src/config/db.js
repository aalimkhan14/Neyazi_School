const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(
    'neyazi_school',
    'root',
    '1234',
    {
        host: 'localhost',
        dialect: 'mysql'
    }
)
module.exports = sequelize
