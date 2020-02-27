// const mysql = require('mysql')
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'bot',
//     password: 'Rp8*nvSRpA17'
// })

// connection.connect((error) => {
//     if (error) throw error
//     console.log('MYSQL CONNESSO')
// })
const { Sequelize } = require('sequelize')
const connection = new Sequelize('tpsit', 'bot', 'Rp8*nvSRpA17', { // TODO: aggiungere pool di connessioni
    host: 'localhost',
    dialect: 'mysql'
})
const models = [, ]

async function testConnection() {
    try {
        await connection.authenticate()
        models.push(require('./models/BannedWords'), require('./models/BannedWords'))
        //global.databaseConnection = connection
        console.log('CONNECTED TO MYSQL')
    } catch (error) {
        console.error(error)
        return false
    }
    await connection.sync()
    return true
}

exports.testConnection = testConnection
exports.connection = connection