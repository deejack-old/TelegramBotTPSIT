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
            let group = await GroupModel.findOne( { where: { chatID: message.chat.id } })
            if (!group) {
                group = GroupModel.build({ chatID: message.chat.id })
                group.save()
                bot.sendMessage("Il bot è stato aggiunto per la prima volta, gli admin attualmente presenti potranno accedere utilizzando l'interfaccia web. \nPer utilizzare le funzioni del bot promuoverlo ad amministratore.")
                let admins = await bot.getChatAdministrators(message.chat.id)
                admins.forEach(admin => {
                    let role = admin.status === 'creator' ? 1 : 2
                    GroupMemberModel.build({ groupID: group.dataValues.id, userID: admin.user.id, roleID: role }).save()
                })
            }
        }
    })
    bot.addListener('message', async (message) => {
        let group = await GroupModel.findOne({ where: { chatID: message.chat.id }})
        //console.log({ group })
        if (!group) return;
        let groupMember = await GroupMemberModel.findOne({ where: { groupID: group.dataValues.id, userID: message.from.id }})
        if (!groupMember) { // Serve davvero avere una tabella degli utenti che hanno scritto?
            bot.sendMessage('Aggiunto ' + (message.from.username || message.from.first_name) + ' al db')
            //let user = await bot.getChatMember(message.from.id)
            GroupMemberModel.build({ groupID: group.dataValues.id, userID: message.from.id, roleID: 3 }).save()
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