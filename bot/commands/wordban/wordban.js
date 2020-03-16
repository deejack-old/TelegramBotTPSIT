const Command = require('../command')
const TelegramBot = require('node-telegram-bot-api')
const groups = require('../../../database/services/group')
const botService = require('../../services/bot')

class WordBan extends Command {
    constructor() {
        super('wordban', 'Ban a word', 1, '/wordban \\{word\\}', false, ['wordBan'])
    }

    /** @param {TelegramBot.Message} message */
    onCommand(message) {
        const wordsToBan = message.text.split(' ')
        wordsToBan.shift()
        wordsToBan.forEach((word) => {
            groups.banWord(message.chat.id, word)
        })
        botService.sendMessage(message.chat.id, `Bannate parole: ${wordsToBan.join(', ')}`)
    }
}

module.exports = WordBan