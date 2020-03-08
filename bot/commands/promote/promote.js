const Command = require('../command')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../../services/bot')
const groupService = require('../../../database/services/group')
const userService = require('../../../database/services/users')
const Role = require('../../../database/models/Role')

class BanCommand extends Command {
    constructor() {
        super('promote', 'Promote a member', 0, '/promote', true, ['promote'])
    }

    /** @param {TelegramBot.Message} message */
    async onCommand(message) {
        let from = await userService.getGroupMember(message.from.id, message.chat.id)
        let target = await userService.getGroupMember(message.reply_to_message.from.id, message.chat.id)
        if (target.roleID === 1) {
            botService.sendMessage(message.chat.id, "L'utente è già di grado massimo")
            return
        }
        if (target.roleID === 2 && from.roleID !== 1) {
            botService.sendMessage(message.chat.id, "Non hai i permessi per promuovere l'utente")
            return
        }
        let name = message.reply_to_message.from.username || ((message.reply_to_message.from.first_name || '') + ' ' + (message.reply_to_message.from.last_name || ''))
        let newRoleID = parseInt(target.roleID) - 1
        console.log('%c' + newRoleID, 'green')
        let newRole = (await Role.findOne({ where: { id: newRoleID } })).dataValues.role
        console.log(newRoleID + ' ' + newRole)
        botService.bot.promoteChatMember(message.chat.id, message.reply_to_message.from.id, {
            can_change_info: true,
            can_delete_messages: true,
            can_invite_users: true,
            can_restrict_members: true,
            can_pin_messages: true,
            can_promote_members: newRoleID === 1
        }).then(async () => {
            await userService.updateRole(message.reply_to_message.from.id, message.chat.id, newRoleID)
            botService.sendMessage(message.chat.id, `L'utente ${botService.mentionUser(name, message.reply_to_message.from.id)} è stato promosso a: ${newRole}`)
        }).catch((error) => {
            console.error(error)
            botService.sendMessage(message.chat.id, "Errore nella promozione dell'utente, controllare che il bot abbia i permessi")
        })
    }
}

module.exports = BanCommand