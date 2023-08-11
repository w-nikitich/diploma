const sequelize = require('../db/db');
const {DataTypes} = require('sequelize');

const Orders = sequelize.define('Orders', {
    user_id : {type: DataTypes.INTEGER, allowNull: false},
    product_id : {type: DataTypes.INTEGER, allowNull: false},
    product_price: {type: DataTypes.INTEGER, allowNull: false},
    amount: {type: DataTypes.INTEGER, allowNull: false},
    order_number: {type: DataTypes.INTEGER, allowNull: false},
    time: {type: DataTypes.DATE, allowNull: false}
}, {
    timestamps: false
});

module.exports = Orders;