const env = require('dotenv').config()
const database = require('./database/database')
const bot = require('./bot/services/bot')
const api = require('./api/app')

async function start() {
    if (await database.testConnection()) {
        bot.start()
        api.start()
    }
}

start()