const Command = require('../command')
const KickModel = require('../../../database/models/Warn')
const TelegramBot = require('node-telegram-bot-api')
const bot = require('../../services/bot').bot

class Info extends Command {
    constructor() {
        super('info', 'Info about a message', 0, '/info')
    }

    onCommand(message) {
        bot.sendMessage(message.chat.id, JSON.stringify(message))
    }
}

module.exports = Info