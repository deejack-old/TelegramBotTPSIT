const Command = require('../command')
const WarnModel = require('../../../database/models/Warn')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../../services/bot')
const groupService = require('../../../database/services/group')

class Staff extends Command {
    constructor() {
        super('staff', 'Show the staff', 0, '/staff', false, ['staff'])
    }

    /** @param {TelegramBot.Message} message */
    async onCommand(message) {
        let admins = await groupService.getAdmins(message.chat.id)
        let text = `Admin: \n\\- ${admins.filter(admin => admin.roleID === 1).map(admin => botService.mentionUser(admin.name, admin.userID)).join('\n\\- ')}\nMod:\n${admins.filter(admin => admin.roleID === 2).map(admin => botService.mentionUser(admin.name, admin.userID)).join('\n\\- ')}`
        botService.sendMessage(message.chat.id, text)
    }
}

module.exports = Staff