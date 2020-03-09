const Permission = require('../models/Permission')
const GroupMember = require('../models/GroupMember')
const Ban = require('../models/Ban')
const Mute = require('../models/Mute')
const Warn = require('../models/Warn')
const Login = require('../models/Login')
const groupService = require('./group')
const generatePassword = require('password-generator')
const crypto = require('crypto');

async function getGroupMember(userID, chatID) {
    let group = await groupService.getGroup(chatID)
    let member = await GroupMember.findOne({ where: { groupID: group.id, userID: userID } })
    return member ? member.dataValues : null
}

async function updateRole(userID, chatID, roleID) {
    let group = await groupService.getGroup(chatID)
    let member = await GroupMember.findOne({ where: { groupID: group.id, userID: userID } })
    if (member) {
        member.setDataValue('roleID', roleID)
        member.save()
    }
}

async function getGroupMemberByID(userID, groupID) {
    let member = await GroupMember.findOne({ where: { groupID: groupID, id: userID } })
    return member ? member.dataValues : null
}

async function getUserPermissions(userID, chatID) {
    let user = await getGroupMember(userID, chatID)
    if (!user) return []
    let permissions = await Permission.findAll({ where: { roleID: user.roleID, } })
    return permissions.map(permission => permission.dataValues.name)
}

async function createMember(userID, name, chatID) {
    let username = name
    let group = await groupService.getGroup(chatID)
    while (GroupMember.count({ where: { name: username, groupID: group.id } }) > 0) {
        username += (Math.random() * 10 + 1)
    }
    GroupMember.build({ groupID: group.id, userID: userID, name: username, roleID: 3 }).save()
}

async function createLogin(userID, chatID) {
    let member = await getGroupMember(userID, chatID)
    if (hasLogin(userID, chatID)) {
        await Login.destroy({ where: { userID: member.id } })
    }
    let password = generatePassword(12, false)
    let hashedPassword = crypto.createHash('md5').update(password).digest('hex')
    Login.build({ userID: member.id, password: hashedPassword }).save()
    return password
}

async function hasLogin(userID, chatID) {
    let member = await getGroupMember(userID, chatID)
    let count = await Login.count({ where: { userID: member.id } })
    return count > 0
}

async function checkLogin(userID, chatID, password) {
    let member = await getGroupMember(userID, chatID)
    let hashedPassword = crypto.createHash('md5').update(password).digest('hex')
    let count = await Login.count({ where: { userID: member.id, password: hashedPassword } })
    return count > 0
}

async function getMemberFromName(groupID, username) {
    let members = await GroupMember.findAll({ where: { groupID: groupID, name: username } })
    return members.length > 0 ? members[0].dataValues : null
}

async function isBanned(userID, chatID) {
    let group = await groupService.getGroup(chatID)
    let member = await getGroupMember(userID, chatID)
    let bans = await Ban.findAll({ where: { userID: member.id, groupID: group.id, disabled: false } })
    return bans.length > 0
}

async function unban(userID, chatID) {
    let group = await groupService.getGroup(chatID)
    let member = await getGroupMember(userID, chatID)
    let bans = await Ban.findAll({ where: { userID: member.id, groupID: group.id, disabled: false } })
    bans.forEach(ban => {
        ban.setDataValue('disabled', true)
        ban.save()
    })
}

async function isMuted(userID, chatID) {
    let group = await groupService.getGroup(chatID)
    let member = await getGroupMember(userID, chatID)
    let mutes = await Mute.findAll({ where: { userID: member.id, groupID: group.id, disabled: false } })
    return mutes.length > 0
}

async function unmute(userID, chatID) {
    let group = await groupService.getGroup(chatID)
    let member = await getGroupMember(userID, chatID)
    let mutes = await Mute.findAll({ where: { userID: member.id, groupID: group.id, disabled: false } })
    mutes.forEach(mute => {
        mute.setDataValue('disabled', true)
        mute.save()
    })
}

async function isWarned(userID, chatID) {
    let group = await groupService.getGroup(chatID)
    let member = await getGroupMember(userID, chatID)
    let warns = await Warn.findAll({ where: { userID: member.id, groupID: group.id, disabled: false } })
    return warns.length > 0
}

async function unwarn(userID, chatID) {
    let group = await groupService.getGroup(chatID)
    let member = await getGroupMember(userID, chatID)
    let warn = await Warn.findOne({ where: { userID: member.id, groupID: group.id, disabled: false } })
    if (warn) {
        warn.setDataValue('disabled', true)
        await warn.save()
    }
}

exports.getGroupMember = getGroupMember
exports.getGroupMemberByID = getGroupMemberByID
exports.getUserPermissions = getUserPermissions
exports.createMember = createMember
exports.createLogin = createLogin
exports.hasLogin = hasLogin
exports.checkLogin = checkLogin
exports.getMemberFromName = getMemberFromName
exports.updateRole = updateRole
exports.isBanned = isBanned
exports.unban = unban
exports.isMuted = isMuted
exports.unmute = unmute
exports.isWarned = isWarned
exports.unwarn = unwarn