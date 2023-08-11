const sequelize = require('../db/db');
const {DataTypes} = require('sequelize');

const Histories = sequelize.define('Histories', {
    user_id : {type: DataTypes.INTEGER, allowNull: false},
    product_id : {type: DataTypes.INTEGER, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    amount: {type: DataTypes.INTEGER, allowNull: false},
    order_number: {type: DataTypes.INTEGER, allowNull: false}
});

module.exports = Histories;