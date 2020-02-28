const PermissionModel = require('../../database/models/Permission')
const RoleModel = require('../../database/models/Role')
const GroupMemberModel = require('../../database/models/GroupMember')
const GroupModel = require('../../database/models/Group')

async function getGroup(chatID) {
    let group = await GroupModel.findOne( { chatID: chatID } )
    return group.dataValues
}

async function getGroupMember(userID, chatID) {
    let groupID = await getGroup(chatID).id
    let member = await GroupMemberModel.findOne({ where: { groupID: groupID, userID: userID } })
    return member.dataValues
}

async function getUserPermissions(userID, chatID) {
    let user = await getGroupMember(userID, chatID)
    let permissions = await PermissionModel.findAll({ where: { roleID: user.roleID } })
    return permissions
}

exports.getGroup = getGroup
exports.getGroupMember = getGroupMember
exports.getUserPermissions = getUserPermissions