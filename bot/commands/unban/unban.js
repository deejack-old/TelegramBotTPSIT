const Command = require('../command')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../../services/bot')
const groupService = require('../../../database/services/group')
const userService = require('../../../database/services/users')

class UnbanCommand extends Command {
    constructor() {
        super('unban', 'Unban a user', 0, '/unban', true, ['unban'])
    }

    /** @param {TelegramBot.Message} message */
    async onCommand(message) {
        let replyFrom = message.reply_to_message.from
        let name = replyFrom.username || ((replyFrom.first_name || '') + ' ' + (replyFrom.last_name || ''))

        let banned = await userService.isBanned(message.reply_to_message.from.id, message.chat.id)
        if (!banned) {
            botService.sendMessage(message.chat.id, "L'utente non è bannato")
            return
        }
        await userService.unban(message.reply_to_message.from.id, message.chat.id)
        botService.sendMessage(message.chat.id, `L'utente ${botService.mentionUser(name, message.reply_to_message.from.id)} è stato sbannato, se l'utente viene kickato a caso dopo questo comando non è colpa mia ma dell'API di telegram o della lib che sto usando, non posso farci nulla`)
        await botService.bot.unbanChatMember(message.chat.id, message.reply_to_message.from.id)
    }
}

module.exports = UnbanCommand