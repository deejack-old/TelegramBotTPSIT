const Command = require('../command')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../../services/bot')
const groupService = require('../../../database/services/group')

class BanCommand extends Command {
    constructor() {
        super('ban', 'Ban a user', 0, '/ban {username} [duration:min] [reason]', true, ['ban'], ['ignoreBans'])
    }

    /** @param {TelegramBot.Message} message */
    async onCommand(message) {
        let bot = botService.bot
        let duration = message.text.split(' ').length > 1 ? this.parseDuration(message.text.split(' ')[1].split(' ')[0]) : ((Date.now() + (60 * 60 * 1000)) / 1000)
        if (duration === -1 || isNaN(duration)) {
            botService.sendMessage(message.chat.id, 'Durata non accettabile, usare /mute 10h \\(d: giorni, h:ore, m: minuti, s: secondi\\)')
            return
        }
        let replyFrom = message.reply_to_message.from
        let name = replyFrom.username || ((replyFrom.first_name || '') + ' ' + (replyFrom.last_name || ''))

        let reason = message.text.split(' ').length > 2 ? message.text.split(' ').splice(2, message.text.split(' ').length).join(' ') : 'Nessuna'
        console.log('Reason: ' + reason)
        bot.kickChatMember(message.chat.id, replyFrom.id, {
            until_date: duration
        })
            .then(() => {
                groupService.banUser(message.chat.id, replyFrom.id, message.from.id, duration * 1000, reason)
                botService.sendMessage(message.chat.id, `Bannato l'utente ${botService.mentionUser(name, replyFrom.id)} fino al giorno ${new Date(duration * 1000).toLocaleString()}\nCausa: ${reason}`)
            })
            .catch((error) => bot.sendMessage(message.chat.id, "Impossibile bannare l'utente, errore: " + error.response.body.description))
    }
}

module.exports = BanCommand