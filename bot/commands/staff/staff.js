const Command = require('../command')
const WarnModel = require('../../../database/models/Warn')
const TelegramBot = require('node-telegram-bot-api')

class Staff extends Command {
    constructor() {
        super('staff', 'Ban a word', 1, '/wordban {word}')
    }

    /** @param {TelegramBot.Message} message */
    onCommand(message) {
        console.log(message)
    }
}

module.exports = Staff