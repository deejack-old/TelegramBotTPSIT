const Command = require('../command')
const WarnModel = require('../../../database/models/Warn')
const GroupModel = require('../../../database/models/Group')
const TelegramBot = require('node-telegram-bot-api')
const bot = require('../../services/bot').bot

class Warn extends Command {
    constructor() {
        super('warn', 'Warn a user', 0, '/warn', true)
    }

    /** @param {TelegramBot.Message} message */
    async onCommand(message) {
        let replyFrom = message.reply_to_message.from
        let groupID = await GroupModel.findOne({
            where: {
                chatID: message.chat.id
            }
        })
        const warn = WarnModel.build({ userID: replyFrom.id, groupID: groupID })
        warn.save()
        let name = replyFrom.username || ((replyFrom.first_name || '') + ' ' + (replyFrom.last_name || ''))
        WarnModel.findAll({
            where: {
                userID: message.reply_to_message.from.id
            }
        }).then((model) => {
            bot.sendMessage(message.chat.id, "L'utente " + name + " è stato warnato (n/3)")
            console.log(model)
        })
    }
}

module.exports = Warn