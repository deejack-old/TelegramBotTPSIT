const { Sequelize, DataTypes, Model } = require('sequelize')
/** @constant @type {Sequelize} */
const sequelize = require('../database').connection

const User = sequelize.define('User', {
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    chatID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
}, {
})

module.exports = User