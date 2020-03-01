const GroupModel = require('../models/Group')
const BannedWordsModel = require('../models/BannedWords')
const WordModel = require('../models/BannedWords')

async function getGroup(chatID) {
    let group = await GroupModel.findOne( { chatID: chatID } )
    return group.dataValues
}

async function getBannedWords(chatID) {
    let group = await getGroup(chatID)
    let words = await BannedWordsModel.findAll({ where: { groupID: group.id } })
    return words.map(word => word.dataValues.word)
}

async function banWord(chatID, word) {
    let group = await getGroup(chatID)
    const wordRecord = WordModel.build({ word: word, groupID: group.id })
    wordRecord.save()
}

exports.getGroup = getGroup
exports.getBannedWords = getBannedWords
exports.banWord = banWord