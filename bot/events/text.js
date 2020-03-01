const Event = require('./event')
const groupService = require('../../database/services/group')
const userService = require('../../database/services/users')
const TelegramBot = require('node-telegram-bot-api')
const bot = require('../services/bot').bot

class TextEvent extends Event {
    constructor() {
        super('text', 'Text message event')
    }

    /** @param {TelegramBot.Message} message */
    async onEvent(message) {
        let user = await userService.getGroupMember(message.from.id, message.chat.id)
        let permissions = await userService.getUserPermissions(message.from.id, message.chat.id)
        console.log({ permissions: permissions })
        if (permissions.includes('ignoreWordBan')) return;
        let bannedWords = await groupService.getBannedWords(message.chat.id)
        let ok = message.text.split(' ').filter(word => bannedWords.includes(word)).length === 0
        console.log({ bannedWords: bannedWords, ok: ok })
        if (!ok) {
            console.log({ bot: bot })
            bot.sendMessage(message.chat.id, `Eliminato il messaggio di [asd](tg://user?id=${message.from.id})`, {
                parse_mode: 'MarkdownV2'
            })
            bot.deleteMessage(message.chat.id, message.message_id)
        }
    }
}

module.exports = TextEvent