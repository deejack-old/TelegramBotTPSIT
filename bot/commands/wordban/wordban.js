const Command = require('../command')
const WordModel = require('../../../database/models/BannedWords')
const TelegramBot = require('node-telegram-bot-api')

class WordBan extends Command {
    constructor() {
        super('wordban', 'Ban a word', 1, '/wordban {word}')
    }

    /** @param {TelegramBot.Message} message */
    onCommand(message) {
        const wordsToBan = message.text.split(' ')
        wordsToBan.shift()
        wordsToBan.forEach((word) => {
            const wordRecord = WordModel.build({ word: word })
            wordRecord.save()
        })
    }
}

module.exports = WordBan