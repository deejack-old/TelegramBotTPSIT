const Command = require('../command')
const WarnModel = require('../../../database/models/Warn')
const TelegramBot = require('node-telegram-bot-api')
const bot = require('../../services/bot').bot

class VoteKick extends Command {
    constructor() {
        super('votekick', 'Ban a word', 0, '/votekick', true)
    }

    /** @param {TelegramBot.Message} message */
    onCommand(message) {
        // if (!message.reply_to_message) {
        //     bot.sendMessage(message.chat.id, 'Devi replicare a un messaggio per kickare!')
        //     return
        // }
        let replyFrom = message.reply_to_message.from
        let name = replyFrom.username || ((replyFrom.first_name || '') + (replyFrom.last_name || ''))
        bot.sendPoll(message.chat.id, 'Vuoi kickare ' + name + '?', ['Sì', 'No']).then((message) => {
            setTimeout(() => {
                bot.stopPoll(message.chat.id, message.message_id).then((result) => {
                    let yes = result.options[0].voter_count
                    let no = result.options[1].voter_count
                    if (yes > no) {
                        bot.kickChatMember(message.chat.id, replyFrom.id)
                            .then(() => bot.sendMessage(message.chat.id, 'Ok, quando ho voglia lo kicko'))
                            .catch(error => bot.sendMessage(message.chat.id, "Impossibile kickare l'utente, errore: " + error.response.body.description)) 
                    }
                    else bot.sendMessage(message.chat.id, "L'utente non verrà kickato")
                })
            }, 10 * 1000)
        })
        
        console.log(message)
    }
}

module.exports = VoteKick