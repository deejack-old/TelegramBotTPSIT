const Event = require('./event')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../services/bot')
const GroupModel = require('../../database/models/Group')
const GroupOptions = require('../../database/models/GroupOptions')
const GroupMemberModel = require('../../database/models/GroupMember')
const Captcha = require('../../database/models/Captcha')
const groupService = require('../../database/services/group')

class TextEvent extends Event {
    constructor() {
        super('new_chat_members', 'When a user join the group')
    }

    /** @param {TelegramBot.Message} message */
    async onEvent(message) {
        console.log(message)
        if (message.new_chat_member.id == botService.botID) {
            let group = await GroupModel.findOne({ where: { chatID: message.chat.id } })
            if (!group) {
                group = await GroupModel.build({ chatID: message.chat.id }).save()
                GroupOptions.build({ groupID: group.dataValues.id }).save()
                botService.sendMessage(message.chat.id, "Il bot è stato aggiunto per la prima volta, gli admin attualmente presenti potranno accedere utilizzando l'interfaccia web\\. \nPer utilizzare le funzioni del bot promuoverlo ad amministratore\\.")
                let admins = await botService.bot.getChatAdministrators(message.chat.id)
                admins.forEach(admin => {
                    let role = admin.status === 'creator' ? 1 : 2
                    let name = admin.user.username || ((admin.user.first_name || '') + ' ' + (admin.user.last_name || ''))
                    GroupMemberModel.build({ groupID: group.dataValues.id, userID: admin.user.id, name: name, roleID: role }).save()
                })
            }
            return
        }
        let groupOptions = (await groupService.getGroupOptions(message.chat.id)).dataValues
        let name = message.new_chat_member.username || (message.new_chat_member.first_name || '') + ' ' + (message.new_chat_member.last_name || '')
        if (groupOptions.obligatoryUsername && !message.new_chat_member.username) {
            botService.bot.kickChatMember(message.chat.id, message.new_chat_member.id)
                .then(() => botService.sendMessage(message.chat.id, `Kickato l'utente ${botService.mentionUser(name, message.new_chat_member.id)} perchè non ha l'username`))
                .catch((error) => {
                    console.error(error)
                    botService.sendMessage(message.chat.id, `Impossibile kickare l'utente ${botService.mentionUser(name, message.new_chat_member.id)}`)
                })
        } else if (groupOptions.captcha) {
            this.sendCaptcha(message.chat.id, name, message.new_chat_member.id)
        }
    }

    sendCaptcha(chatID, name, userID) {
        botService.bot.sendMessage(chatID, `Benvenuto ${botService.mentionUser(name, userID)}, completa il captcha in 30 secondi o verrai kickato\\!`, {
            reply_markup: {
                inline_keyboard: [[{ text: 'Captcha', callback_data: 'captcha:' + userID }]]
            },
            parse_mode: 'MarkdownV2'
        })
        setTimeout(async () => {
            let captcha = await Captcha.findOne({ where: { userID: userID } })
            if (!captcha) {
                botService.bot.kickChatMember(chatID, userID)
                    .then(() => botService.sendMessage(chatID, `Kickato l'utente ${botService.mentionUser(name, userID)} per non aver risolto il captcha`))
                    .catch((error) => {
                        console.error(error)
                        botService.sendMessage(chatID, `Impossibile kickare l'utente ${botService.mentionUser(name, userID)}`)
                    })
            } else {
                captcha.destroy()
            }
        }, 30 * 1000)
    }
}

module.exports = TextEvent