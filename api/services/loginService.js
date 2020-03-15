const crypto = require('crypto')
const userService = require('../../database/services/users')
const groupService = require('../../database/services/group')
const AuthToken = require('../../database/models/AuthToken')

function generateToken(userID, groupID) {
    let token = crypto.randomBytes(30).toString('hex')
    AuthToken.build({ token: token, userID: userID, groupID: groupID }).save()
    return token
}

async function checkLogin(groupID, userID, password) {
    let member = await userService.getGroupMemberByID(userID, groupID)
    let group = await groupService.getGroupFromID(groupID)
    return member && group && userService.checkLogin(member.dataValues.userID, group.chatID, password)
}

async function getAuthToken(token) {
    let authToken = await AuthToken.findOne({ token: token })
    return authToken ? authToken.dataValues : null
}

exports.generateToken = generateToken
exports.checkLogin = checkLogin
exports.getAuthToken = getAuthToken