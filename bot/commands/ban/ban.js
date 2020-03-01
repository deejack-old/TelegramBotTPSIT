const Command = require('../command')
const bot = require('../../services/bot').bot

class BanCommand extends Command {
    constructor() {
        super('ban', 'Ban a user', 1, '/ban {username} [duration:min] [reason]', true, ['ban'], ['ignoreBans'])
    }

    onCommand(message) {
        bot.sendMessage(message.chat.id, 'Comando non ancora implementato')
    }
}

module.exports = BanCommand