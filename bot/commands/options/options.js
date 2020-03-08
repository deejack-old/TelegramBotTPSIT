const Command = require('../command')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../../services/bot')
const groupService = require('../../../database/services/group')

class Options extends Command {
    constructor() {
        super('options', 'Bot options', 0, '/options', false, ['options'])
    }

    /** @param {TelegramBot.Message} message */
    async onCommand(message) {
        let options = (await groupService.getGroupOptions(message.chat.id)).dataValues
        botService.bot.sendMessage(message.chat.id, 'Impostazioni del gruppo', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: `Toggle night mode (${options.nightEnabled ? 'ON' : 'OFF'})`,
                            callback_data: 'night'
                        },
                        {
                            text: `Toggle username required (${options.obligatoryUsername ? 'ON' : 'OFF'})`,
                            callback_data: 'username'
                        }
                    ],
                    [
                        {
                            text: `Toggle captcha (${options.captcha ? 'ON' : 'OFF'})`,
                            callback_data: 'captcha'
                        }
                    ]
                ]
            }
        })
    }
}

module.exports = Options