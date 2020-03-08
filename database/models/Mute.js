const { Sequelize, DataTypes, Model } = require('sequelize')
/** @constant @type {Sequelize} */
const sequelize = require('../database').connection
const Group = require('./Group')
const GroupMember = require('./GroupMember')

const Mute = sequelize.define('Mute', {
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
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: GroupMember,
            key: 'id'
        }
    },
    adminID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: GroupMember,
            key: 'id'
        }
    },
    untilDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {

})

Mute.belongsTo(GroupMember, { foreignKey: 'userID', targetKey: 'id', as: 'user' })
Mute.belongsTo(GroupMember, { foreignKey: 'adminID', targetKey: 'id', as: 'admin' })


module.exports = Mute