const sequelize = require('../db/db');
const {DataTypes} = require('sequelize');

const Users = sequelize.define('Users', {
    chat_id: {type: DataTypes.INTEGER, unique: true, allowNull: false},
    name: {type: DataTypes.STRING},
    surname: {type: DataTypes.STRING},
});

module.exports = Users;