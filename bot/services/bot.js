const TelegramBot = require('node-telegram-bot-api')
const token = '1032794534:AAGxPSe8_OnOoUMdk9uWcIEDpjCE5Q9HlzM'
const bot = new TelegramBot(token)
const fs = require('fs')
const GroupModel = require('../../database/models/Group')
const GroupMemberModel = require('../../database/models/GroupMember')
const commands = []//new (require('../commands/ban/ban'))(), new (require('../commands/kick/kick'))(), new (require('../commands/wordban/wordban'))(), new (require('../commands/warn/warn'))()]
const events = []
// bot.on('text', (message) => {
//     console.group('msg')
//     console.log(message)
//     console.groupEnd()
//     bot.sendMessage(message.chat.id, message.text)
// })


function start() {
    bot.startPolling().then(() => {
        console.log('BOT avviato')
        fs.readdir(__dirname + '\\..\\commands', (error, files) => {
            files.forEach(file => {
                if (!file.endsWith('.js')) {
                    let command = require(`../commands/${file}/${file}.js`)
                    commands.push(new command())
                }
            })
            registerCommands()
        })
        events.push(new (require('./../events/text'))())
        registerEvents()
    }).catch((error) => console.error(error))
}

function registerEvents() {
    bot.addListener('new_chat_members', async (message) => {
        console.assert(message.new_chat_member.id == token.split(':')[0], 'Non è il bot')
        if (message.new_chat_member.id == token.split(':')[0]) {
            let group = await GroupModel.findOne({ where: { chatID: message.chat.id } })
            if (!group) {
                group = GroupModel.build({ chatID: message.chat.id })
                group.save()
                bot.sendMessage(message.chat.id, "Il bot è stato aggiunto per la prima volta, gli admin attualmente presenti potranno accedere utilizzando l'interfaccia web. \nPer utilizzare le funzioni del bot promuoverlo ad amministratore.")
                let admins = await bot.getChatAdministrators(message.chat.id)
                console.log(admins)
                admins.forEach(admin => {
                    let role = admin.status === 'creator' ? 1 : 2
                    let name = admin.user.username || ((admin.user.first_name || '') + ' ' + (admin.user.last_name || ''))
                    GroupMemberModel.build({ groupID: group.dataValues.id, userID: admin.user.id, name: name, roleID: role }).save()
                })
            }
        }
    })
    events.forEach(event => bot.addListener(event.name, (message) => event.beforeEvent(message)))
}

function registerCommands() {
    console.log(commands)
    // Deve essere l'inizio della stringa, deve contenere il comando e poi deve esserci uno o più spazi oppure deve essere la fine del messaggio, se no prendendo /ban prende anche /banana
    commands.forEach((command) => bot.onText(new RegExp("^/" + command.name + "( +|$)"), (message) => command.beforeCommand(message)))
}

exports.start = start
exports.bot = bot
exports.mentionUser = (username, userID) => `[${username}](tg://user?id=${userID})`
exports.sendMessage = (chatID, message) => bot.sendMessage(chatID, message, { parse_mode: 'MarkdownV2' })
exports.botID = token.split(':')[0]