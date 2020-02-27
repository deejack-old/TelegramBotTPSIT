const api = require('./api/app')
const database = require('./database/database')
const bot = require('./bot/services/bot')

async function start() {
    if (await database.testConnection()) {
        bot.start()
        api.start()
    }
}

start()