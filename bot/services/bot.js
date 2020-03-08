const TelegramBot = require('node-telegram-bot-api')
const token = '1032794534:AAGxPSe8_OnOoUMdk9uWcIEDpjCE5Q9HlzM'
const bot = new TelegramBot(token)
const fs = require('fs')
const commands = []//new (require('../commands/ban/ban'))(), new (require('../commands/kick/kick'))(), new (require('../commands/wordban/wordban'))(), new (require('../commands/warn/warn'))()]
const events = [new (require('./../events/text'))(), new (require('./../events/join'))(), new (require('./../events/callback'))()]

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
        registerEvents()
    }).catch((error) => console.error(error))
}

function registerEvents() {
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