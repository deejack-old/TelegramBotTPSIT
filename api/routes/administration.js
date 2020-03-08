const router = require('express').Router()
const groupService = require('../services/groupService')

router.use((request, response, next) => {
    if (request.token) {
        next()
    } else {
        response.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        })
    }
})

router.use('/api/events', require('./api/events'))

router.post('/send', (request, response) => {
    let group = request.token.groupID
    console.log(request.body)
    let text = request.body.text
    if (!text) {
        response.send('Insert the text!')
        return
    }
    groupService.sendMessage(group, text)
})

router.get('/', (request, response) => {
    response.render('administration', { username: request.token.username })
})

module.exports = router