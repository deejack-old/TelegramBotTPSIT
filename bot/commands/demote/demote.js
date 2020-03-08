const Command = require('../command')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../../services/bot')
const groupService = require('../../../database/services/group')
const userService = require('../../../database/services/users')
const Role = require('../../../database/models/Role')

class BanCommand extends Command {
    constructor() {
        super('demote', 'Demote a member', 0, '/demote', true, ['demote'])
    }

    /** @param {TelegramBot.Message} message */
    async onCommand(message) {
        let from = await userService.getGroupMember(message.from.id, message.chat.id)
        let target = await userService.getGroupMember(message.reply_to_message.from.id, message.chat.id)
        if (target.roleID === 3) {
            botService.sendMessage(message.chat.id, "L'utente è già di grado minimo")
            return
        }
        if (target.roleID === 1 && from.roleID !== 1) {
            botService.sendMessage(message.chat.id, "Non hai i permessi per degradare l'utente")
            return
        }
        let name = message.reply_to_message.from.username || ((message.reply_to_message.from.first_name || '') + ' ' + (message.reply_to_message.from.last_name || ''))
        let newRoleID = parseInt(target.roleID) + 1
        console.log('%c' + newRoleID, 'green')
        let newRole = (await Role.findOne({ where: { id: newRoleID } })).dataValues.role
        console.log('%c' + newRoleID + ' ' + newRole, 'green')
        botService.bot.promoteChatMember(message.chat.id, message.reply_to_message.from.id, {
            can_change_info: newRoleID === 2,
            can_delete_messages: newRoleID === 2,
            can_invite_users: newRoleID === 2,
            can_restrict_members: newRoleID === 2,
            can_pin_messages: newRoleID === 2,
            can_promote_members: false
        }).then(async () => {
            await userService.updateRole(message.reply_to_message.from.id, message.chat.id, newRoleID)
            botService.sendMessage(message.chat.id, `L'utente ${botService.mentionUser(name, message.reply_to_message.from.id)} è stato degradato a: ${newRole}`)
        }).catch((error) => botService.sendMessage(message.chat.id, "Errore nella degradazione dell'utente, controllare che il bot abbia i permessi"))
    }
}

module.exports = BanCommand