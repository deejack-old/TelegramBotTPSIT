const Command = require('../command')
const WarnModel = require('../../../database/models/Warn')
const GroupModel = require('../../../database/models/Group')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../../services/bot')
const groupService = require('../../../database/services/group')

class Warn extends Command {
    constructor() {
        super('warn', 'Warn a user', 0, '/warn', true, ['warn'], ['ignoreWarn'])
    }

    /** @param {TelegramBot.Message} message */
    async onCommand(message) {
        let replyFrom = message.reply_to_message.from
        let reason = message.text.split(' ').length > 1 ? message.text.split(' ').splice(1, message.text.split(' ').length).join(' ') : 'Nessuna'
        let asd = await groupService.warnUser(message.chat.id, replyFrom.id, message.from.id, reason)
        let warnCount = await groupService.getWarnCount(message.chat.id, replyFrom.id)

        let name = replyFrom.username || ((replyFrom.first_name || '') + ' ' + (replyFrom.last_name || ''))
        botService.sendMessage(message.chat.id, `L'utente ${botService.mentionUser(name, replyFrom.id)} è stato warnato ${warnCount} volta/e, al 3° warn verrà kickato, al 6° bannato`)
        if (warnCount > 5) {
            botService.bot.kickChatMember(message.chat.id, replyFrom.id, {
                until_date: (Date.now() / 1000) + (24 * 60 * 60)
            })
                .then((done) => {
                    if (done) {
                        groupService.banUser(message.chat.id, replyFrom.id, message.from.id, 24 * 60 * 60 * 1000, `${warnCount} warn`)
                        botService.sendMessage(message.chat.id, `Bannato l'utente ${botService.mentionUser(name, replyFrom.id)} fino al giorno ${new Date(Date.now() + (24 * 60 * 60 * 1000)).toLocaleString()}\nCausa: ${warnCount} warn`)
                    }
                })
                .catch((error) => {
                    console.error(error)
                    botService.sendMessage(message.chat.id, "Impossibile bannare l'utente")
                })
        } else if (warnCount > 2) {
            botService.bot.kickChatMember(message.chat.id, replyFrom.id)
                .then((done) => {
                    if (done) {
                        groupService.kickUser(message.chat.id, message.reply_to_message.from.id, message.from.id, `${warnCount} warn`)
                        botService.sendMessage(message.chat.id, `L'utente ${botService.mentionUser(name, replyFrom.id)} è stato kickato`)
                    }
                })
                .catch((error) => {
                    console.error(error)
                    botService.sendMessage(message.chat.id, "Impossibile kickare l'utente, errore: " + error.response.body.description)
                })
        }
    }
}

module.exports = Warn