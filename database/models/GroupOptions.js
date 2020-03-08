const { Sequelize, DataTypes, Model } = require('sequelize')
/** @constant @type {Sequelize} */
const sequelize = require('../database').connection
const Group = require('../models/Group')

const Options = sequelize.define('Options', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    groupID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Group,
            key: 'id'
        }
    },
    nightEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    nightStart: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: '23:00'
    },
    nightStop: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: '06:00'
    },
    obligatoryUsername: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    captcha: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
}, {
})

module.exports = Options