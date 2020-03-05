const crypto = require('crypto')
const userService = require('../../database/services/users')
const groupService = require('../../database/services/group')
const AuthToken = require('../../database/models/AuthToken')

function generateToken(username, groupID) {
    let token = crypto.randomBytes(30).toString('hex')
    AuthToken.build({ token: token, username: username, groupID: groupID }).save()
    return token
}

async function checkLogin(groupID, username, password) {
    let member = await userService.getMemberFromName(groupID, username)
    let group = await groupService.getGroupFromID(groupID)
    return member && group && userService.checkLogin(member.userID, group.chatID, password)
}

async function getAuthToken(token) {
    let authToken = await AuthToken.findOne({ token: token })
    return authToken ? authToken.dataValues : null
}

exports.generateToken = generateToken
exports.checkLogin = checkLogin
exports.getAuthToken = getAuthToken