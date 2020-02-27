const Command = require('../command')

class BanCommand extends Command {
    constructor() {
        super('ban', 'Ban a user', 1, '/ban {username} [duration:min] [reason]')
    }

    onCommand(message) {
        console.error('asd')
    }
}

module.exports = BanCommand