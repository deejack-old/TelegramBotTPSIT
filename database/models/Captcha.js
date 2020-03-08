const { Sequelize, DataTypes, Model } = require('sequelize')
/** @constant @type {Sequelize} */
const sequelize = require('../database').connection

const Captcha = sequelize.define('Captcha', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userID: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
})

module.exports = Captcha