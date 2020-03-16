const Command = require('../command')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../../services/bot')
const groupService = require('../../../database/services/group')
const GroupMember = require('../../../database/models/GroupMember')

class BanCommand extends Command {
    constructor() {
        super('changename', 'Change the name in the DB', 1, '/changename \\{username\\}', false, ['changename'], [], false)
    }

    /** @param {TelegramBot.Message} message */
    async onCommand(message) {
        let group = await groupService.getGroup(message.chat.id)
        let member = await GroupMember.findOne({ where: { groupID: group.id, userID: message.from.id } })
        if (!member) {
            botService.sendMessage(message.chat.id, 'Non sei registrato\\?\\!')
            return
        }
        let name = message.text.split(' ')[1]
        member.setDataValue('name', name)
        member.save()
        botService.sendMessage(message.chat.id, `Ora ti chiami ${botService.mentionUser(name, message.from.id)}`)
    }
}

module.exports = BanCommand