const Event = require('./event')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../services/bot')
const GroupModel = require('../../database/models/Group')
const GroupMemberModel = require('../../database/models/GroupMember')

class TextEvent extends Event {
    constructor() {
        super('new_chat_members', 'When a user join the group')
    }

    /** @param {TelegramBot.Message} message */
    async onEvent(message) {
        if (message.new_chat_member.id == botService.botID) {
            let group = await GroupModel.findOne({ where: { chatID: message.chat.id } })
            if (!group) {
                group = GroupModel.build({ chatID: message.chat.id })
                group.save()
                botService.sendMessage(message.chat.id, "Il bot è stato aggiunto per la prima volta, gli admin attualmente presenti potranno accedere utilizzando l'interfaccia web. \nPer utilizzare le funzioni del bot promuoverlo ad amministratore.")
                let admins = await botService.bot.getChatAdministrators(message.chat.id)
                admins.forEach(admin => {
                    let role = admin.status === 'creator' ? 1 : 2
                    let name = admin.user.username || ((admin.user.first_name || '') + ' ' + (admin.user.last_name || ''))
                    GroupMemberModel.build({ groupID: group.dataValues.id, userID: admin.user.id, name: name, roleID: role }).save()
                })
            }
        }
    }
}

module.exports = TextEvent