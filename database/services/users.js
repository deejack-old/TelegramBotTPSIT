const PermissionModel = require('../../database/models/Permission')
const GroupMemberModel = require('../../database/models/GroupMember')
const groupService = require('./group')

async function getGroupMember(userID, chatID) {
    let group = await groupService.getGroup(chatID)
    let member = await GroupMemberModel.findOne({ where: { groupID: group.id, userID: userID } })
    return member ? member.dataValues : null
}

async function getUserPermissions(userID, chatID) {
    let user = await getGroupMember(userID, chatID)
    let permissions = await PermissionModel.findAll({ where: { roleID: user.roleID,  } })
    return permissions.map(permission => permission.dataValues.name)
}

async function createMember(userID, name, chatID) {
    let group = await groupService.getGroup(chatID)
    GroupMemberModel.build({ groupID: group.id, userID: userID, name: name, roleID: 3 }).save()
}

exports.getGroupMember = getGroupMember
exports.getUserPermissions = getUserPermissions
exports.createMember = createMember