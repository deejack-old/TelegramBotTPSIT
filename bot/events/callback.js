const Event = require('./event')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../services/bot')
const GroupModel = require('../../database/models/Group')
const GroupOptions = require('../../database/models/GroupOptions')
const GroupMemberModel = require('../../database/models/GroupMember')
const Captcha = require('../../database/models/Captcha')
const groupService = require('../../database/services/group')
const userService = require('../../database/services/users')

class CallbackEvent extends Event {
    constructor() {
        super('callback_query', 'callback from inline keyboard')
    }

    /** @param {TelegramBot.CallbackQuery} callback */
    async onEvent(callback) {
        if (callback.data.startsWith('captcha:')) {
            this.solveCaptcha(callback)
            return
        }
        let permissions = await userService.getUserPermissions(callback.message.from.id, callback.message.chat.id)
        if (!permissions.includes('modifyOptions'))
            return
        
        let options = await groupService.getGroupOptions(callback.message.chat.id)
        switch (callback.data) {
            case 'night':
                options.setDataValue('nightEnabled', !options.nightEnabled)
                options.save()
                break
            case 'username':
                options.setDataValue('obligatoryUsername', !options.obligatoryUsername)
                options.save()
                break
            case 'captcha':
                options.setDataValue('captcha', !options.captcha)
                options.save()
                break
            default: throw new Error('Callback non supportata: ' + callback.data)
        }
        botService.bot.editMessageReplyMarkup({
            inline_keyboard: [
                [
                    {
                        text: `Toggle night mode (${options.dataValues.nightEnabled ? 'ON' : 'OFF'})`,
                        callback_data: 'night'
                    },
                    {
                        text: `Toggle username required (${options.dataValues.obligatoryUsername ? 'ON' : 'OFF'})`,
                        callback_data: 'username'
                    }
                ],
                [
                    {
                        text: `Toggle captcha (${options.dataValues.captcha ? 'ON' : 'OFF'})`,
                        callback_data: 'captcha'
                    }
                ]
            ]
        }, {
            inline_message_id: callback.inline_message_id,
            message_id: callback.message.message_id,
            chat_id: callback.message.chat.id
        })
    }

    async solveCaptcha(callback) {
        let id = callback.data.split(':')[1]
        if (callback.from.id !== id) {
            botService.bot.answerCallbackQuery(callback.id, {
                text: "Solo il nuovo utente può risolvere il captcha",
                show_alert: true
            })
            return
        }
        let captcha = await Captcha.findOne({ where: { userID: id } })
        if (captcha) return
        await Captcha.build({ userID: id }).save()
        botService.bot.editMessageReplyMarkup({
            inline_keyboard: [[]]
        }, {
            inline_message_id: callback.inline_message_id
        })
        botService.bot.editMessageText(`Captcha risolto`, {
            message_id: callback.message.message_id,
            chat_id: callback.message.chat.id
        })
    }
}

module.exports = CallbackEvent