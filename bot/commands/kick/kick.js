const Command = require('../command')
const bot = require('../../services/bot').bot
const groupService = require('../../../database/services/group')

class Kick extends Command {
    constructor() {
        super('kick', 'Kick a user', 0, '/kick [reason]', true, ['kick'], ['ignoreKick'])
    }

    onCommand(message) {
        // if (!message.reply_to_message) {
        //     bot.sendMessage(message.chat.id, 'Devi replicare a un messaggio per kickare!')
        //     return
        // }
        let replyFrom = message.reply_to_message.from
        let userID = replyFrom.id
        //if (userID)
        let reason = message.text.split(' ').length > 1 ? message.text.split(' ').splice(1, message.text.split(' ').length).join(' ') : 'Nessuna'
        bot.kickChatMember(message.chat.id, userID)
            .then(() => {
                groupService.kickUser(message.chat.id, message.reply_to_message.from.id, message.from.id, reason)
                bot.sendMessage(message.chat.id, "Utente kickato")
            })
            .catch((error) => {
                console.error(error)
                bot.sendMessage(message.chat.id, "Impossibile kickare l'utente, errore: " + error.response.body.description)
            })
    }
}

module.exports = Kick