const Command = require('../command')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../../services/bot')

class Options extends Command {
    constructor() {
        super('options', 'Bot options', 0, '/options', false, ['options'])
    }

    /** @param {TelegramBot.Message} message */
    onCommand(message) {
        botService.sendMessage(message.chat.id, 'Comando non implementato')
    }
}

module.exports = Options