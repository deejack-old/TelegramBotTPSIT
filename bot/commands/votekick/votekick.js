const Command = require('../command')
const WarnModel = require('../../../database/models/Warn')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../../services/bot')
const groupService = require('../../../database/services/group')

class VoteKick extends Command {
    constructor() {
        super('votekick', 'Vote to kick a user', 0, '/votekick', true, ['votekick'], ['ignoreKick'])
    }

    /** @param {TelegramBot.Message} message */
    async onCommand(message) {
        let replyFrom = message.reply_to_message.from
        let name = replyFrom.username || ((replyFrom.first_name || '') + ' ' + (replyFrom.last_name || ''))
        try {
            let poll = await botService.bot.sendPoll(message.chat.id,
                `Vuoi kickare ${botService.mentionUser(name, message.from.id)}? \nIl poll dura 1 ora \nRichiesta la maggioranza di sì e il numero di sì deve essere maggiore del 60% del gruppo`,
                ['Sì', 'No'],
                {
                    parse_mode: 'MarkdownV2',
                    reply_to_message_id: message.message_id
                })
            setTimeout(async () => {
                let result = await botService.bot.stopPoll(message.chat.id, poll.message_id)
                let yes = result.options[0].voter_count
                let no = result.options[1].voter_count
                let memberCount = await botService.bot.getChatMembersCount(message.chat.id)
                if (yes > no && yes > ((memberCount / 100 * 60) - 1)) { // i sì devono essere maggiori del 60% - il bot, da controlalre
                    botService.bot.kickChatMember(message.chat.id, userID)
                        .then(() => {
                            groupService.kickUser(message.chat.id, message.reply_to_message.from.id, `Votekick, ${yes} sì e ${no} no`)
                            botService.bot.sendMessage(message.chat.id, "L'utente è stato kickato", {
                                reply_to_message_id: message.message_id
                            })
                        })
                        .catch((error) => {
                            console.error(error)
                            botService.bot.sendMessage(message.chat.id, "Impossibile kickare l'utente, errore: " + error.response.body.description, {
                                reply_to_message_id: message.message_id
                            })
                        })
                }
                else botService.bot.sendMessage(message.chat.id, "L'utente non verrà kickato", {
                    reply_to_message_id: message.message_id
                })
            }, 10 * 10 * 1000);//60 * 60 * 1000) // 1 h
        } catch (exception) {
            console.error(exception)
        }
    }
}

module.exports = VoteKick