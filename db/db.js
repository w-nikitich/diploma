const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'cafedev',
    'cafe_admin',
    'U0CwY81QglOc',
    {
        host: 'localhost',
        port: 5432,
        dialect: 'postgres'
    }
);