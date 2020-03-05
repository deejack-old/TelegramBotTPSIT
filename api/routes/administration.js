const router = require('express').Router()
const groupService = require('../../database/services/group')

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

router.get('/', (request, response) => {
    response.render('administration', { username: request.token.username })
})

router.get('/api/admins', (request, response) => {

})

router.delete('/api/admins', (request, response) => {

})

router.get('/api/events', async (request, response) => {
    let events = await groupService.getEvents(request.token.groupID)
    response.json(events)
})

module.exports = router