const Command = require('../command')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../../services/bot')
const groupService = require('../../../database/services/group')
const userService = require('../../../database/services/users')

class BanCommand extends Command {
    constructor() {
        super('requestlogin', 'Request the creation of a password to login into the web panel', 0, '/requestlogin', false, ['requestLogin'])
    }

    /** @param {TelegramBot.Message} message */
    async onCommand(message) {
        let hasLogin = await userService.hasLogin(message.from.id, message.chat.id)
        let force = message.text.split(' ')[1] === '-force'
        if (hasLogin && !force) {
            botService.bot.sendMessage(message.chat.id, "Hai già richiesto la password, nel caso l'avessi dimenticata richiedila usando /requestlogin -force", {
                reply_to_message_id: message.message_id
            })
            return
        }
        botService.bot.sendMessage(message.chat.id, 'La password ti verrà mandata in chat privata', {
            reply_to_message_id: message.message_id
        })
        try {
            await botService.sendMessage(message.from.id, 'Sto creando la password temporanea')
        } catch {
            botService.bot.sendMessage(message.chat.id, "Errore, controlla di aver avviato il bot nella chat privata e che non sia bloccato", {
                reply_to_message_id: message.message_id
            })
            return
        }
        let password = await userService.createLogin(message.from.id, message.chat.id)
        let user = await userService.getGroupMember(message.from.id, message.chat.id)
        let group = await groupService.getGroup(message.chat.id)
        botService.bot.sendMessage(message.from.id,
            `La tua password temporanea è: ${password}, il tuo username è ${user.name}, l'id del gruppo è ${group.id} <a href=\"t.me/c/${message.chat.id.toString().substr(message.chat.id.toString().length - 10, 10)}/${message.message_id}\">richiesta</a>`, {
                parse_mode: 'HTML'
            })
    }
}

module.exports = BanCommand