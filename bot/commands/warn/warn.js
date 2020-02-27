const Command = require('../command')
const WarnModel = require('../../../database/models/Warn')
const TelegramBot = require('node-telegram-bot-api')

class Warn extends Command {
    constructor() {
        super('warn', 'Ban a word', 1, '/warn {word}')
    }

    /** @param {TelegramBot.Message} message */
    onCommand(message) {
        console.log(message)
    }
}

module.exports = Warn