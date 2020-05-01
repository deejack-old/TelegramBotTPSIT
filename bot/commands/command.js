const TelegramBot = require('node-telegram-bot-api')
let userService = require('../../database/services/users')
const botService = require('../services/bot')

class Command {
    constructor(name, description, minArgs, examplePattern, replyRequired = false, permissionsRequired = [], ignorePermissions = [], groupRequired = true) {
        this.name = name
        this.description = description
        this.minArgs = minArgs
        this.examplePattern = examplePattern
        this.replyRequired = replyRequired
        this.permissionsRequired = permissionsRequired
        this.ignorePermissions = ignorePermissions
        this.groupRequired = groupRequired
    }

    /** @param {TelegramBot.Message} message */
    onCommand(message) {
        throw new Error('You must implement this method')
    }

    /** @param {TelegramBot.Message} message */
    async beforeCommand(message) { //TODO: rifare sta merda
        if (this.groupRequired && message.chat.type === 'private') {
            botService.sendMessage(message.chat.id, 'Non puoi usare il comando in chat privata\\!')
            return
        }

        if (this.replyRequired && message.reply_to_message && message.reply_to_message.from.id == botService.botID) {
            botService.sendMessage(message.chat.id, 'Come osi provare a usare i comandi contro di me')
            return
        }
        console.log('BEFORE COMMAND')
        try {
            let userPermission = await userService.getUserPermissions(message.from.id, message.chat.id)
            let permNeeded = this.permissionsRequired.filter(perm => !userPermission.includes(perm))
            if (permNeeded.length > 0 && !userPermission.includes('*')) {
                botService.sendMessage(message.chat.id, 'Non hai i permessi necessari')
                return
            }
            if (this.replyRequired && !message.reply_to_message) {
                botService.sendMessage(message.chat.id, 'Devi replicare a un messaggio')
                return
            }
            if (message.text.split(' ').length < this.minArgs + 1) {
                botService.sendMessage(message.chat.id, this.examplePattern)
                return
            }
            if (message.reply_to_message) {
                let replyToUserPerm = await userService.getUserPermissions(message.reply_to_message.from.id, message.chat.id)

                if ((replyToUserPerm.includes('*') && !userPermission.includes('*')) || (this.ignorePermissions.length > 0 && replyToUserPerm.filter(perm => this.ignorePermissions.includes(perm)).length > 0)) {
                    botService.sendMessage(message.chat.id, "Non puoi applicare questo comando su quell'utente")
                } else
                    this.onCommand(message)
            } else
                this.onCommand(message)
        } catch (exception) {
            console.error(exception)
            botService.sendMessage(message.chat.id, "Errore nell'esecuzione del comando: " + exception)
        }
    }


    /** @param {String} duration */
    parseDuration(duration) {
        if (duration.length < 2)
            return -1
        let untilDate = Date.now()
        let number = 0
        try {
            number = parseFloat(duration.substring(0, duration.length - 1))
            console.log(number)
        } catch {
            return -1
        }
        console.log(duration.substr(duration.length - 1, 1))
        switch (duration.substr(duration.length - 1, 1)) {
            case 's':
                untilDate += (number * 1000)
                break;
            case 'm':
                untilDate += (number * 60 * 1000)
                break;
            case 'h':
                untilDate += (number * 60 * 60 * 1000)
                break;
            case 'd':
                untilDate += (number * 24 * 60 * 60 * 1000)
                break;
            default:
                return -1
        }
        console.log(untilDate / 1000)
        return untilDate / 1000
    }
}

module.exports = Command