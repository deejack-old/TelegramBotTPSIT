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
        if (message.chat.type === 'private') {
            // console.log({chat: message.chat, from: message.from})
            // let user = await userService.getChatID(message.from.id)
            // if (!user) {
            //     userService.registerChatID(message.from.id, message.chat.id)
            //     botService.sendMessage(message.chat.id, 'Sei ora registrato nel bot\\!')
            // }
            return
        }
        //let user = await userService.getGroupMember(message.from.id, message.chat.id)
        this.checkTime(message.chat.id, message.message_id)
        this.checkBannedWords(message)
        this.checkAdminMention(message)
    }

    /** @param {TelegramBot.Message} message */
    async checkAdminMention(message) {
        let text = message.text
        if (text.startsWith('@admin')) {
            botService.bot.sendMessage(message.chat.id, 'Ho mandato un messaggio agli admin', {
                reply_to_message_id: message.message_id
            })
            let admins = await groupService.getAdmins(message.chat.id)
            admins.forEach(async (admin) => {
                let chatID = message.chat.id.toString()
                try {
                    let helpMessage = await botService.bot.forwardMessage(admin.userID, message.chat.id, message.message_id)
                    botService.bot.sendMessage(admin.userID,
                        `Un utente ha richiesto l'aiuto degli admin, [vai al messaggio](t.me/c/${chatID.substr(chatID.length - 10, 10)}/${message.message_id})`, {
                        reply_to_message_id: helpMessage.message_id,
                        parse_mode: 'MarkdownV2'
                    })
                } catch { } // L'utente ha bloccato o non startato il bot
            })
        }
    }

    async checkBannedWords(message) {
        let permissions = await userService.getUserPermissions(message.from.id, message.chat.id)
        if (permissions.includes('ignoreWordBan') || permissions.includes('*')) return;
        let bannedWords = await groupService.getBannedWords(message.chat.id)
        let ok = message.text.split(' ').filter(word => bannedWords.includes(word)).length === 0
        let name = message.from.username || ((message.from.first_name || '') + ' ' + (message.from.last_name || ''))
        if (!ok) {
            botService.sendMessage(message.chat.id, `Eliminato il messaggio di ${botService.mentionUser(name, message.from.id)}`)
            botService.bot.deleteMessage(message.chat.id, message.message_id)
        }
    }

    async checkTime(chatID, messageID) {
        let now = new Date()
        let options = await groupService.getGroupOptions(chatID)
        if (!options.nightEnabled)
            return
        let nightStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), options.nightStart.split(':')[0], options.nightStart.split(':')[1])
        let nightStop = new Date(now.getFullYear(), now.getMonth(), now.getDate(), options.nightStop.split(':')[0], options.nightStop.split(':')[1])
        if (now > nightStart || now < nightStop) {
            botService.bot.deleteMessage(chatID, messageID)
            console.log('NOTTEEEEEE')
        }
    }
}

module.exports = TextEvent