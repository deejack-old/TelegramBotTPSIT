const Command = require('../command')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../../services/bot')
const groupService = require('../../../database/services/group')
const userService = require('../../../database/services/users')

class UnwarnCommand extends Command {
    constructor() {
        super('unwarn', 'Unban a user', 0, '/unban', true, ['unban'])
    }

    /** @param {TelegramBot.Message} message */
    async onCommand(message) {
        let replyFrom = message.reply_to_message.from
        let name = replyFrom.username || ((replyFrom.first_name || '') + ' ' + (replyFrom.last_name || ''))

        let warned = await userService.isWarned(message.reply_to_message.from.id, message.chat.id)
        if (!warned) {
            botService.sendMessage(message.chat.id, "L'utente non è warnato")
            return
        }
        await userService.unwarn(message.reply_to_message.from.id, message.chat.id)
        let warnCount = await groupService.getWarnCount(message.chat.id, message.reply_to_message.from.id)
        botService.sendMessage(message.chat.id, `All'utente ${botService.mentionUser(name, message.reply_to_message.from.id)} è stato rimosso un warn, numero di warn: ${warnCount}`)
    }
}

module.exports = UnwarnCommand