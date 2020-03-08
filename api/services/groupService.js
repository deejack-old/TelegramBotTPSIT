const Kick = require('../../database/models/Kick')
const Warn = require('../../database/models/Warn')
const Ban = require('../../database/models/Ban')
const Mute = require('../../database/models/Mute')
const GroupMember = require('../../database/models/GroupMember')
const groupDBService = require('../../database/services/group')
const botService = require('../../bot/services/bot')

async function disableBan(id) {
    let ban = await Ban.findOne({ id: id })
    if (ban) {
        ban.setDataValue('disabled', true)
        ban.save()
        return true
    }
    return false
}

async function disableWarn(id) {
    let warn = await Warn.findOne({ id: id })
    if (warn) {
        warn.setDataValue('disabled', true)
        warn.save()
        return true
    }
    return false
}

async function disableMute(id) {
    let mute = await Mute.findOne({ id: id })
    if (mute) {
        mute.setDataValue('disabled', true)
        mute.save()
        return true
    }
    return false
}

async function sendMessage(groupID, text) {
    let chatID = (await groupDBService.getGroupFromID(groupID)).chatID
    botService.sendMessage(chatID, text)
}

async function getEvents(groupID) {
    let bans = await Ban.findAll({ where: { groupID: groupID }, include: [{ model: GroupMember, as: 'user' }, { model: GroupMember, as: 'admin' }] })
        .map(ban => ban.dataValues)
    bans.forEach(ban => { ban.userName = ban.user.name; delete ban.user; ban.adminName = ban.admin.name; delete ban.admin })
    let kicks = await Kick.findAll({ where: { groupID: groupID }, include: [{ model: GroupMember, as: 'user' }, { model: GroupMember, as: 'admin' }] })
        .map(kick => kick.dataValues)
    kicks.forEach(kick => { kick.userName = kick.user.name; delete kick.user; kick.adminName = kick.admin.name; delete kick.admin })
    let mutes = await Mute.findAll({ where: { groupID: groupID }, include: [{ model: GroupMember, as: 'user' }, { model: GroupMember, as: 'admin' }] })
        .map(mute => mute.dataValues)
    mutes.forEach(mute => { mute.userName = mute.user.name; delete mute.user; mute.adminName = mute.admin.name; delete mute.admin })
    let warns = await Warn.findAll({ where: { groupID: groupID }, include: [{ model: GroupMember, as: 'user' }, { model: GroupMember, as: 'admin' }] })
        .map(warn => warn.dataValues)
    warns.forEach(warn => { warn.userName = warn.user.name; delete warn.user; warn.adminName = warn.admin.name; delete warn.admin })
    return {
        bans: bans,
        kicks: kicks,
        mutes: mutes,
        warns: warns
    }
}

exports.disableBan = disableBan
exports.disableWarn = disableWarn
exports.disableMute = disableMute
exports.getEvents = getEvents
exports.sendMessage = sendMessage