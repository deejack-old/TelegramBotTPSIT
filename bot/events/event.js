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
        let groupMember = await userService.getGroupMember(event.from.id, event.chat.id)// await GroupMemberModel.findOne({ where: { groupID: group.dataValues.id, userID: message.from.id } })
        
        let name = event.from.username || ((event.from.first_name || '') + ' ' + (event.from.last_name || ''))
        if (!groupMember) { // Serve davvero avere una tabella degli utenti che hanno scritto?
            let result = await userService.createMember(event.from.id, name, event.chat.id)
            botService.sendMessage(message.chat.id, 'Aggiunto ' + botService.mentionUser(message.from.username || message.from.first_name, event.from.id) + ' al db')
        }
        if (event.reply_to_message) {
            let replyFrom = await userService.getGroupMember(event.reply_to_message.from.id, event.chat.id)// await GroupMemberModel.findOne({ where: { groupID: group.dataValues.id, userID: message.from.id } })
            if (!replyFrom) { // Serve davvero avere una tabella degli utenti che hanno scritto?
                let result = await userService.createMember(event.reply_to_message.from.id, name, event.chat.id)
                botService.sendMessage(event.chat.id, 'Aggiunto ' + botService.mentionUser(event.reply_to_message.from.username || event.reply_to_message.from.first_name, event.reply_to_message.from.id) + ' al db')
            }
        }
        this.onEvent(event)
    }
}

module.exports = Event