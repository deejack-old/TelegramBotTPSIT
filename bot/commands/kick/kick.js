const Command = require('../command')

class Kick extends Command {
    constructor() {
        super('kick', 'Kick a user', 1, '/kick {username}')
    }

    onCommand(message) {
        console.log('kicking...')
    }
}

module.exports = Kick