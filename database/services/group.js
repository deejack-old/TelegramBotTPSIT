const Group = require('../models/Group')
const BannedWord = require('../models/BannedWords')
const Word = require('../models/BannedWords')
const Warn = require('../models/Warn')
const Ban = require('../models/Ban')
const Mute = require('../models/Mute')
const Kick = require('../models/Kick')
const GroupMember = require('../models/GroupMember')
const GroupOptions = require('../models/GroupOptions')
const userService = require('./users')
const botService = require('../../bot/services/bot')

async function getGroup(chatID) {
    let group = await Group.findOne({ chatID: chatID })
    return group.dataValues
}

async function getBannedWords(chatID) {
    let group = await getGroup(chatID)
    let words = await BannedWord.findAll({ where: { groupID: group.id } })
    return words.map(word => word.dataValues.word)
}

async function banWord(chatID, word) {
    let group = await getGroup(chatID)
    const wordRecord = Word.build({ word: word, groupID: group.id })
    wordRecord.save()
}

async function warnUser(chatID, userID) {
    let group = await getGroup(chatID)
    let user = await userService.getGroupMember(userID, chatID)
    const warn = Warn.build({ groupID: group.id, userID: user.id })
    warn.save()
}

async function getWarnCount(chatID, userID) {
    let group = await getGroup(chatID)
    let user = await userService.getGroupMember(userID, chatID)
    let warns = await Warn.findAll({ where: { groupID: group.id, userID: user.id } })
    return warns.length
}

async function kickUser(chatID, userID, adminID, reason) {
    let group = await getGroup(chatID)
    let bannedUser = await userService.getGroupMember(userID)
    let admin = await userService.getGroupMember(adminID)
    Kick.build({ groupID: group.id, userID: bannedUser.id, adminID: admin.id, reason: reason }).save()
}

async function banUser(chatID, userID, adminID, duration, reason) {
    let group = await getGroup(chatID)
    let bannedUser = await userService.getGroupMember(userID)
    let admin = await userService.getGroupMember(adminID)
    Ban.build({ groupID: group.id, userID: bannedUser.id, adminID: admin.id, untilDate: new Date(duration), reason: reason }).save()
}

async function muteUser(chatID, userID, adminID, duration, reason) {
    let group = await getGroup(chatID)
    let bannedUser = await userService.getGroupMember(userID)
    let admin = await userService.getGroupMember(adminID)
    Mute.build({ groupID: group.id, userID: bannedUser.id, adminID: admin.id, untilDate: new Date(duration), reason: reason }).save()
}

async function getAdmins(chatID) {
    let group = await getGroup(chatID)
    let admins = await GroupMember.findAll({ where: { groupID: group.id, roleID: [1, 2] } })
    return admins.map(admin => admin.dataValues)
}

async function getGroupOptions(chatID) {
    let group = await getGroup(chatID)
    let option = (await GroupOptions.findAll({ where: { groupID: group.id } }))[0]
    return option.dataValues
}

exports.getGroup = getGroup
exports.getBannedWords = getBannedWords
exports.banWord = banWord
exports.warnUser = warnUser
exports.getWarnCount = getWarnCount
exports.kickUser = kickUser
exports.banUser = banUser
exports.muteUser = muteUser
exports.getAdmins = getAdmins
exports.getGroupOptions = getGroupOptions