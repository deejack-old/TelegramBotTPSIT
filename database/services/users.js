const Permission = require('../models/Permission')
const GroupMember = require('../models/GroupMember')
const User = require('../models/User')
const groupService = require('./group')

async function getGroupMember(userID, chatID) {
    let group = await groupService.getGroup(chatID)
    let member = await GroupMember.findOne({ where: { groupID: group.id, userID: userID } })
    return member ? member.dataValues : null
}

async function getUserPermissions(userID, chatID) {
    let user = await getGroupMember(userID, chatID)
    let permissions = await Permission.findAll({ where: { roleID: user.roleID, } })
    return permissions.map(permission => permission.dataValues.name)
}

async function createMember(userID, name, chatID) {
    let group = await groupService.getGroup(chatID)
    GroupMember.build({ groupID: group.id, userID: userID, name: name, roleID: 3 }).save()
}

// async function registerChatID(userID, chatID) {
//     User.build({ userID: userID, chatID: chatID }).save()
// }

// async function getChatID(userID) {
//     let user = User.findOne({ where: { userID: userID }})
//     return user ? user.dataValues : null
// }

exports.getGroupMember = getGroupMember
exports.getUserPermissions = getUserPermissions
exports.createMember = createMember
// exports.registerChatID = registerChatID
// exports.getChatID = getChatID