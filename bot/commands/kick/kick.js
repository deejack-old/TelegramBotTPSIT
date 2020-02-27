const Command = require('../command')
const KickModel = require('../../../database/models/Warn')
const TelegramBot = require('node-telegram-bot-api')
const bot = require('../../services/bot').bot

class Kick extends Command {
    constructor() {
        super('kick', 'Kick a user', 0, '/kick {username}')
    }

    onCommand(message) {
        if (!message.reply_to_message) {
            bot.sendMessage(message.chat.id, 'Devi replicare a un messaggio per kickare!')
            return
        }
        let replyFrom = message.reply_to_message.from
        let userID = replyFrom.id
        //if (userID)
        bot.kickChatMember(message.chat.id, userID)
            .catch((error) => {
                console.error(error)
                bot.sendMessage(message.chat.id, "Impossibile kickare l'utente, errore: " + error.response.body.description)
            })
    }
}

module.exports = Kick