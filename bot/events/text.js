const Event = require('./event')
const groupService = require('../../database/services/group')
const userService = require('../../database/services/users')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../services/bot')

class TextEvent extends Event {
    constructor() {
        super('text', 'Text message event')
    }

    /** @param {TelegramBot.Message} message */
    async onEvent(message) {
        //let user = await userService.getGroupMember(message.from.id, message.chat.id)
        let permissions = await userService.getUserPermissions(message.from.id, message.chat.id)
        if (permissions.includes('ignoreWordBan')) return;
        let bannedWords = await groupService.getBannedWords(message.chat.id)
        let ok = message.text.split(' ').filter(word => bannedWords.includes(word)).length === 0
        let name = message.from.username || ((message.from.first_name || '') + ' ' + (message.from.last_name || ''))
        if (!ok) {
            botService.sendMessage(message.chat.id, `Eliminato il messaggio di ${botService.mentionUser(name, message.from.id)}`)
            botService.bot.deleteMessage(message.chat.id, message.message_id)
            return
        }
        let text = message.text
        if (text.startsWith('@admin')) {
            botService.bot.sendMessage(message.chat.id, 'Ho mandato un messaggio agli admin', {
                reply_to_message_id: message.message_id
            })
            let admins = await groupService.getAdmins(message.chat.id)
            admins.forEach(admin => {
                botService.bot.getChatMember(message.chat.id, admin.userID).then(console.log)
                //botService.sendMessage()
            })
        }
    }
}

module.exports = TextEvent