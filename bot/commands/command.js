class Command {
    constructor(name, description, minArgs, examplePattern) {
        this.name = name
        this.description = description
        this.minArgs = minArgs
        this.examplePattern = examplePattern
    }

    onCommand(message) {
        throw new Error('You must implement this method')
    }

    beforeCommand(message) {
        if (message.text.split(' ').length < this.minArgs + 1) {
            return {
                ok: false,
                message: this.examplePattern
            }
        } else return {
            ok: true
        }
    }
}

module.exports = Command