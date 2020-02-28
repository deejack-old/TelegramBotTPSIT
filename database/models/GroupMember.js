const { Sequelize, DataTypes, Model } = require('sequelize')
const Group = require('./Group')
const Role = require('./Role')
/** @constant @type {Sequelize} */
const sequelize = require('../database').connection

const GroupMember = sequelize.define('GroupMember', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    groupID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Group,
            key: 'id'
        }
    },
    roleID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: 'id'
        }
    }
}, {
})

module.exports = GroupMember