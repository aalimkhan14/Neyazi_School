// const {Sequelize} = require('sequelize');

// const sequelize = new Sequelize(
//     'neyazi_school',
//     'root',
//     '1234',
//     {
//         host: 'localhost',
//         dialect: 'mysql'
//     }
// )
// module.exports = sequelize



const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database/school.sqlite'),
    logging: false
});

module.exports = sequelize;
