const Command = require('../command')
const WarnModel = require('../../../database/models/Warn')
const TelegramBot = require('node-telegram-bot-api')
const sendMessage = require('../../services/bot').sendMessage

class Options extends Command {
    constructor() {
        super('options', 'Ban a word', 1, '/wordban {word}')
    }

    /** @param {TelegramBot.Message} message */
    onCommand(message) {
        if (!message.reply_to_message) {
            sendMessage('Devi replicare a un messaggio per kickare!')
        }
        console.log(message)
    }
}

module.exports = Options