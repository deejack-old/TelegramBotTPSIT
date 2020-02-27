const TelegramBot = require('node-telegram-bot-api')
const token = '1032794534:AAGxPSe8_OnOoUMdk9uWcIEDpjCE5Q9HlzM'
const bot = new TelegramBot(token)

const commands = [new (require('../commands/ban/ban'))(), new (require('../commands/kick/kick'))()]

// bot.on('text', (message) => {
//     console.group('msg')
//     console.log(message)
//     console.groupEnd()
//     bot.sendMessage(message.chat.id, message.text)
// })

function start() {
    bot.startPolling().then(() => {
        console.log('BOT avviato')
        registerCommands()
    }).catch((error) => console.error(error))
}

function registerCommands() {
    // Deve essere l'inizio della stringa, deve contenere il comando e poi deve esserci uno o più spazi oppure deve essere la fine del messaggio, se no prendendo /ban prende anche /banana
    commands.forEach((command) => bot.onText(new RegExp("^/" + command.name + "( +|$)"), (text) => {
        let result = command.beforeCommand(text)
        console.log(result)
        if (result.ok) 
            command.onCommand(text)
        else
            bot.sendMessage(text.chat.id, result.message)
    }))
}

exports.start = start