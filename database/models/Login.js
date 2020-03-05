const { Sequelize, DataTypes, Model } = require('sequelize')
/** @constant @type {Sequelize} */
const sequelize = require('../database').connection
const GroupMember = require('./GroupMember')

const Login = sequelize.define('Login', {
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: GroupMember,
            key: 'id'
        }
    },
    password: {
        type: DataTypes.STRING(32),
        allowNull: false
    }
}, {
})

module.exports = Login