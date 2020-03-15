const Kick = require('../../database/models/Kick')
const Warn = require('../../database/models/Warn')
const Ban = require('../../database/models/Ban')
const Mute = require('../../database/models/Mute')
const GroupMember = require('../../database/models/GroupMember')
const groupDBService = require('../../database/services/group')
const userDBService = require('../../database/services/users')
const botService = require('../../bot/services/bot')

async function disableBan(id, groupID) {
    let ban = await Ban.findOne({ where: { id: id, groupID: groupID } })
    if (ban) {
        ban.setDataValue('disabled', true)
        ban.save()
        let member = await userDBService.getGroupMemberByID(ban.dataValues.userID)
        let group = await groupDBService.getGroupFromID(ban.dataValues.groupID)
        botService.bot.unbanChatMember(group.chatID, member.dataValues.userID)
        return true
    }
    return false
}

async function disableWarn(id, groupID) {
    let warn = await Warn.findOne({ where: { id: id, groupID: groupID } })
    if (warn) {
        warn.setDataValue('disabled', true)
        warn.save()
        return true
    }
    return false
}

async function disableMute(id, groupID, tgID) {
    let mute = await Mute.findOne({ where: { id: id, groupID: groupID } })
    if (mute) {
        mute.setDataValue('disabled', true)
        mute.save()
        let member = await userDBService.getGroupMemberByID(mute.dataValues.userID)
        let group = await groupDBService.getGroupFromID(mute.dataValues.groupID)
        botService.bot.restrictChatMember(group.chatID, member.dataValues.userID, { can_send_media_messages: true, can_send_messages: true, can_send_other_messages: true })
        return true
    }
    return false
}

async function sendMessage(groupID, text) {
    let chatID = (await groupDBService.getGroupFromID(groupID)).chatID
    botService.sendMessage(chatID, text)
}

async function getUsers(groupID) {
    let members = (await GroupMember.findAll({ where: { groupID: groupID } })).map(member => member.dataValues)
    return members
}

async function getAdmins(groupID) {
    let chatID = (await groupDBService.getGroupFromID(groupID)).chatID
    let admins = (await groupDBService.getAdmins(chatID))
    return admins
}

async function getBans(groupID) {
    let bans = await Ban.findAll({ where: { groupID: groupID }, include: [{ model: GroupMember, as: 'user' }, { model: GroupMember, as: 'admin' }] })
        .map(ban => ban.dataValues)
    bans.forEach(ban => {
        ban.userName = ban.user.name; delete ban.user; ban.adminName = ban.admin.name; delete ban.admin;
        ban.createdAt = new Date(ban.createdAt).toLocaleString()
        ban.untilDate = new Date(ban.untilDate).toLocaleString()
    })
    return bans
}

async function getKicks(groupID) {
    let kicks = await Kick.findAll({ where: { groupID: groupID }, include: [{ model: GroupMember, as: 'user' }, { model: GroupMember, as: 'admin' }] })
        .map(kick => kick.dataValues)
    kicks.forEach(kick => {
        kick.userName = kick.user.name; delete kick.user; kick.adminName = kick.admin.name; delete kick.admin;
        kick.createdAt = new Date(kick.createdAt).toLocaleString()
    })
    return kicks
}

async function getMutes(groupID) {
    let mutes = await Mute.findAll({ where: { groupID: groupID }, include: [{ model: GroupMember, as: 'user' }, { model: GroupMember, as: 'admin' }] })
        .map(mute => mute.dataValues)
    mutes.forEach(mute => {
        mute.userName = mute.user.name; delete mute.user; mute.adminName = mute.admin.name; delete mute.admin;
        mute.createdAt = new Date(mute.createdAt).toLocaleString()
        mute.untilDate = new Date(mute.untilDate).toLocaleString()
    })
    return mutes
}

async function getWarns(groupID) {
    let warns = await Warn.findAll({ where: { groupID: groupID }, include: [{ model: GroupMember, as: 'user' }, { model: GroupMember, as: 'admin' }] })
        .map(warn => warn.dataValues)
    warns.forEach(warn => {
        warn.userName = warn.user.name; delete warn.user; warn.adminName = warn.admin.name; delete warn.admin;
        warn.createdAt = new Date(warn.createdAt).toLocaleString()
    })
    return warns
}

async function getEvents(groupID) {
    let bans = await getBans(groupID)
    let kicks = await getKicks(groupID)
    let mutes = await getMutes(groupID)
    let warns = await getWarns(groupID)
    return {
        bans: bans,
        kicks: kicks,
        mutes: mutes,
        warns: warns
    }
}

async function promote(userID, groupID, adminID) {
    let group = await groupDBService.getGroupFromID(groupID)
    let user = await userDBService.getGroupMemberByID(userID, groupID)
    let admin = await userDBService.getGroupMemberByID(adminID, groupID)
    console.log({ group: group, user: user, admin: admin })
    if (!user || !admin || user.dataValues.roleID <= admin.roleID)
        return false
    let newRole = user.dataValues.roleID - 1
    user.setDataValue('roleID', newRole)
    user.save()
    botService.bot.promoteChatMember(group.chatID, user.dataValues.userID, {
        can_change_info: true, can_delete_messages: true, can_invite_users: true, can_restrict_members: true, can_pin_messages: true, can_promote_members: newRole === 1
    }).catch(error => botService.sendMessage(group.chatID, "Impossibile promuovere l'utente\\!"))
        .then(() => botService.sendMessage(group.chatID, `L'utente ${botService.mentionUser(user.dataValues.name, user.dataValues.userID)} è stato promosso`))
    return true
}

async function demote(userID, groupID, adminID) {
    let group = await groupDBService.getGroupFromID(groupID)
    let user = await userDBService.getGroupMemberByID(userID, groupID)
    let admin = await userDBService.getGroupMemberByID(adminID, groupID)
    if (!user || !admin || user.dataValues.roleID <= admin.roleID)
        return false
    let newRole = user.dataValues.roleID + 1
    user.setDataValue('roleID', newRole)
    user.save()
    botService.bot.promoteChatMember(group.chatID, user.dataValues.userID, {
        can_change_info: newRole < 3, can_delete_messages: newRole < 3, can_invite_users: newRole < 3, can_restrict_members: newRole < 3, can_pin_messages: newRole < 3, can_promote_members: newRole === 1
    }).catch(error => botService.sendMessage(group.chatID, "Impossibile degradare l'utente\\!"))
        .then(() => botService.sendMessage(group.chatID, `L'utente ${botService.mentionUser(user.dataValues.name, user.dataValues.userID)} è stato degradato`))
    return true
}

async function ban(userID, groupID, adminID, tgUserID) {
    let group = await groupDBService.getGroupFromID(groupID)
    Ban.build({ groupID: groupID, userID: userID, adminID: adminID, untilDate: new Date(Date.now() + (24 * 60 * 60 * 1000)), reason: 'From webpanel' }).save()
    try {
        await botService.bot.kickChatMember(group.chatID, tgUserID, {
            until_date: (Date.now() + (24 * 60 * 60 * 1000)) / 1000
        })
        return true
    } catch (exception) {
        console.error(exception)
        return false
    }
}

async function kick(userID, groupID, adminID, tgUserID) {
    let group = await groupDBService.getGroupFromID(groupID)
    Kick.build({ groupID: groupID, userID: userID, adminID: adminID, reason: 'From webpanel' }).save()
    try {
        await botService.bot.kickChatMember(group.chatID, tgUserID)
        return true
    } catch (exception) {
        console.error(exception)
        return false
    }
}

exports.disableBan = disableBan
exports.disableWarn = disableWarn
exports.disableMute = disableMute
exports.getEvents = getEvents
exports.sendMessage = sendMessage
exports.getUsers = getUsers
exports.getAdmins = getAdmins
exports.demote = demote
exports.promote = promote
exports.ban = ban
exports.kick = kick