const Command = require('../command')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../../services/bot')
const groupService = require('../../../database/services/group')
const userService = require('../../../database/services/users')

class UnmuteCommand extends Command {
    constructor() {
        super('unmute', 'Unban a user', 0, '/unban', true, ['unban'])
    }

    /** @param {TelegramBot.Message} message */
    async onCommand(message) {
        let bot = botService.bot

        let replyFrom = message.reply_to_message.from
        let name = replyFrom.username || ((replyFrom.first_name || '') + ' ' + (replyFrom.last_name || ''))

        let muted = await userService.isMuted(message.reply_to_message.from.id, message.chat.id)
        if (!muted) {
            botService.sendMessage(message.chat.id, "L'utente non è mutato")
            return
        }
        await userService.unmute(message.reply_to_message.from.id, message.chat.id)
        botService.sendMessage(message.chat.id, `L'utente ${botService.mentionUser(name, message.reply_to_message.from.id)} è stato smutato`)
        botService.bot.restrictChatMember(message.chat.id, message.reply_to_message.from.id, {
            can_send_media_messages: true,
            can_send_other_messages: true,
            can_send_messages: true,
            can_add_web_page_previews: true
        })
    }
}

module.exports = UnmuteCommand