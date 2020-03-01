const TelegramBot = require('node-telegram-bot-api')
let userService = require('../../database/services/users')
const bot = require('../services/bot').bot

class Command {
    constructor(name, description, minArgs, examplePattern, replyRequired = false, permissionsRequired = [], ignorePermissions = []) {
        this.name = name
        this.description = description
        this.minArgs = minArgs
        this.examplePattern = examplePattern
        this.replyRequired = replyRequired
        this.permissionsRequired = permissionsRequired
        this.ignorePermissions = ignorePermissions
    }

    /** @param {TelegramBot.Message} message */
    onCommand(message) {
        throw new Error('You must implement this method')
    }

    /** @param {TelegramBot.Message} message */
    async beforeCommand(message) {
        console.log('BEFORE COMMAND')
        //console.log(this.minArgs)
        //let permRequired = this.permissionsRequired
        try {
            let userPermission = await userService.getUserPermissions(message.from.id, message.chat.id)
            let permNeeded = this.permissionsRequired.filter(perm => !userPermission.includes(perm))
            console.log(permNeeded)
            if (permNeeded.length > 0 && !userPermission.includes('*')) {
                bot.sendMessage(message.chat.id, 'Non hai i permessi necessari')
            } else if (message.text.split(' ').length < this.minArgs + 1) {
                bot.sendMessage(message.chat.id, this.examplePattern)
            } else if (this.replyRequired && !message.reply_to_message) {
                bot.sendMessage(message.chat.id, 'Devi replicare a un messaggio')
            }
            else this.onCommand(message)
        } catch(exception) {
            console.error(exception)
        }
        
        // userService.getUserPermissions(message.from.id, message.chat.id)
        //     .then((userPermission) => {
        //         let permNeeded = permRequired.filter(perm => !userPermission.includes(perm))
        //         console.log(permNeeded)
        //         if (permNeeded.length > 0 && !userPermission.includes('*')) {
        //             bot.sendMessage(message.chat.id, 'Non hai i permessi necessari')
        //         } else if (message.text.split(' ').length < this.minArgs + 1) {
        //             bot.sendMessage(message.chat.id, this.examplePattern)
        //         } else if (this.replyRequired && !message.reply_to_message) {
        //             bot.sendMessage(message.chat.id, 'Devi replicare a un messaggio')
        //         } 
        //         else this.onCommand(message)
        //     })
        //     .catch(console.error)

    }
}

module.exports = Command