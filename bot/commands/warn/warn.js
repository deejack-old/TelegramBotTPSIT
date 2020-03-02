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
        let asd = await groupService.warnUser(message.chat.id, replyFrom.id)
        let warnCount = await groupService.getWarnCount(message.chat.id, replyFrom.id)
        
        let name = replyFrom.username || ((replyFrom.first_name || '') + ' ' + (replyFrom.last_name || ''))
        botService.sendMessage(message.chat.id, `L'utente ${botService.mentionUser(name, replyFrom.id)} è stato warnato ${warnCount} volta/e, al 3° warn verrà kickato, al 6° bannato`)
        if (warnCount > 2) {
            botService.sendMessage(message.chat.id, `L'utente ${botService.mentionUser(name, replyFrom.id)} è stato kickato`)
            groupService.kickUser(message.chat.id, replyFrom.id, `${warnCount} warn`)
        } else if (warnCount > 5) {
            botService.sendMessage(message.chat.id, `L'utente ${botService.mentionUser(name, replyFrom.id)} è stato bannato`)
            groupService.banUser(message.chat.id, replyFrom.id, 24 * 60 * 60 * 1000, `${warnCount} warn`)
        }
    }
}

module.exports = Warn