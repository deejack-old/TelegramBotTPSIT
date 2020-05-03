const router = require('express').Router()
const groupService = require('../services/groupService')
const userService = require('../../database/services/users')

router.use((request, response, next) => {
    if (request.token) {
        userService.getGroupMemberByID(request.token.userID, request.token.groupID).then((user) => {
            if (!user || user.dataValues.roleID > 2) {
                response.status(401)
                response.end()
                return
            }
            request.user = user.dataValues
            next()
        })
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
    response.render('administration', { username: request.user.name })
})

module.exports = router