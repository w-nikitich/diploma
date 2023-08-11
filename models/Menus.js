const sequelize = require('../db/db');
const {DataTypes} = require('sequelize');

const Menus = sequelize.define('Menus', {
    name: {type: DataTypes.STRING, allowNull: false},
    photo: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING},
    price: {type: DataTypes.INTEGER, allowNull: false},
    category: {type: DataTypes.STRING, allowNull: false},
    ingredients: {type: DataTypes.STRING}
}, {
    timestamps: false
});

module.exports = Menus;