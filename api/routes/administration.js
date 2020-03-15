const router = require('express').Router()
const groupService = require('../services/groupService')
const userService = require('../../database/services/users')

router.use(async (request, response, next) => {
    if (request.token) {
        let user = await userService.getGroupMemberByID(request.token.userID, request.token.groupID)
        if (!user || user.dataValues.roleID > 2) {
            response.status(401)
            response.end()
            return
        }
        request.user = user
        next()
    } else {
        response.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        })
    }
})

router.use('/api/events', require('./api/events'))
router.use('/api/info', require('./api/info'))
router.use('/api/admins', require('./api/admins'))

router.post('/send', (request, response) => {
    let group = request.token.groupID
    let text = request.body.text
    if (!text) {
        response.status(400)
        response.send('Insert the text!')
        return
    }
    groupService.sendMessage(group, text)
})

router.get('/', async (request, response) => {
    let events = await groupService.getEvents(request.token.groupID)
    let users = await groupService.getUsers(request.token.groupID)
    let admins = await groupService.getAdmins(request.token.groupID)

    response.render('administration', { username: request.user.name, bans: events.bans, kicks: events.kicks, mutes: events.mutes, warns: events.warns, admins: admins, users: users })
})

module.exports = router