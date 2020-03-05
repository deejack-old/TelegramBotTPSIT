const { Sequelize, DataTypes, Model } = require('sequelize')
/** @constant @type {Sequelize} */
const sequelize = require('../database').connection
const Group = require('./Group')

const AuthToken = sequelize.define('AuthToken', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    token: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    groupID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Group,
            key: 'id'
        }
    }
}, {
})

module.exports = AuthToken