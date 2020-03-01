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
        models.push(require('./models/Group'),
            require('./models/Role'),
            require('./models/Permission'),
            require('./models/GroupMember'),
            require('./models/BannedWords'), 
            require('./models/Warn'))
        //global.databaseConnection = connection
        console.log('CONNECTED TO MYSQL')
    } catch (error) {
        console.error(error)
        return false
    }
    await connection.sync()
    addDefaultRecords()
    return true
}

async function addDefaultRecords() {
    let role = require('./models/Role')
    let roleCount = await role.count()
    if (roleCount === 0) {
        role.build({ role: 'Admin' }).save()
        role.build({ role: 'Mod' }).save()
        role.build({ role: 'User' }).save()
        role.build({ role: 'Banned' }).save()
    }
    let permission = require('./models/Permission')
    let permCount = await permission.count()
    if (permCount === 0) {
        permission.build({ roleID: 1, name: '*' }).save()
        let userPerms = ['write', 'callAdmin', 'viewStaff', 'votekick']
        let modPerms = [...userPerms, 'ignoreBans', 'ignoreWordBan', 'ban', 'mute', 'warn', 'info']
        modPerms.forEach(perm => permission.build({ roleID: 2, name: perm }).save())
        userPerms.forEach(perm => permission.build({ roleID: 3, name: perm }).save())
        
    }
}

exports.testConnection = testConnection
exports.connection = connection