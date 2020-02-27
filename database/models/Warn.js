const { Sequelize, DataTypes, Model } = require('sequelize')
/** @constant @type {Sequelize} */
const sequelize = require('../database').connection

const Warn = sequelize.define('Warn', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    word: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
})

module.exports = Warn