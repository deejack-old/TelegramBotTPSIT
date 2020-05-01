const groupService = require('../../database/services/group')
const userService = require('../../database/services/users')
const botService = require('../services/bot')

class Event {
    constructor(name, description) {
        this.name = name
        this.description = description
    }

    /** @param {TelegramBot.Message} message */
    async onEvent(event) {
        throw new Error('Not implemented')
    }

    /** @param {TelegramBot.Message} event */
    async beforeEvent(event) {
        if (event.chat && event.chat.type === "private")
            return;
        console.log({ beforeEvent: event })
        let chatID = event.chat ? event.chat.id : event.message.chat.id
        let group = await groupService.getGroup(chatID)
        if (!group && this.name === 'new_chat_members') {
            this.onEvent(event)
            return
        }

        let groupMember = await userService.getGroupMember(event.from.id, chatID)
        let name = event.from.username || ((event.from.first_name || '') + ' ' + (event.from.last_name || ''))
        if (!groupMember && event.from.id != botService.botID) {
            let result = await userService.createMember(event.from.id, name, chatID)
            botService.sendMessage(chatID, 'Aggiunto ' + botService.mentionUser(name, event.from.id) + ' al db')
        }
        if (event.reply_to_message && event.reply_to_message.from.id != botService.botID) {
            let replyFrom = await userService.getGroupMember(event.reply_to_message.from.id, chatID)
            if (!replyFrom) {
                let replyName = event.reply_to_message.from.username || ((event.reply_to_message.from.first_name || '') + ' ' + (event.reply_to_message.from.last_name || ''))
                let result = await userService.createMember(event.reply_to_message.from.id, replyName, chatID)
                botService.sendMessage(chatID, 'Aggiunto ' + botService.mentionUser(replyName, event.reply_to_message.from.id) + ' al db')
            }
        }
        this.onEvent(event)
    }
}

module.exports = Event