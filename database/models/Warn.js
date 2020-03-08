const { Sequelize, DataTypes, Model } = require('sequelize')
/** @constant @type {Sequelize} */
const sequelize = require('../database').connection
const Group = require('./Group')
const GroupMember = require('./GroupMember')

const Warn = sequelize.define('Warn', {
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
    reason: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'Nessuna'
    },
    disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
})

Warn.belongsTo(GroupMember, { foreignKey: 'userID', targetKey: 'id', as: 'user' })
Warn.belongsTo(GroupMember, { foreignKey: 'adminID', targetKey: 'id', as: 'admin' })


module.exports = Warn