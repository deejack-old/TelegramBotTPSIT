const { Sequelize, DataTypes, Model } = require('sequelize')
/** @constant @type {Sequelize} */
const sequelize = require('../database').connection

const BannedWord = sequelize.define('BannedWord', {
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

module.exports = BannedWord