class Event {
    constructor(name, description) {
        this.name = name
        this.description = description
    }

    /** @param {TelegramBot.Message} message */
    async onEvent(event) {
        throw new Error('Not implemented')
    }

    /** @param {TelegramBot.Message} message */
    beforeEvent(event) {
        console.log('BEFORE')
        this.onEvent(event)
    }
}

module.exports = Event