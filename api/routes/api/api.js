const router = require('express').Router()
const groupService = require('../../services/groupService')

router.post('/send', (request, response) => {
    let group = request.token.groupID
    let text = request.body.text
    if (!text) {
        response.send('Insert the text!')
        return
    }
    groupService.sendMessage(group, text)
})

router.delete('/ban', async (request, response) => {
    let id = request.body.id
    if (!id) {
        response.send('Insert the id!')
        return
    }
    let ok = await groupService.disableBan(id)
    response.send({ ok: ok })
})

router.delete('/warn', async (request, response) => {
    let id = request.body.id
    if (!id) {
        response.send('Insert the id!')
        return
    }
    let ok = await groupService.disableBan(id)
    response.send({ ok: ok })
})

router.delete('/mute', async (request, response) => {
    let id = request.body.id
    if (!id) {
        response.send('Insert the id!')
        return
    }
    let ok = await groupService.disableBan(id)
    response.send({ ok: ok })
})

router.delete('/admins', (request, response) => {

})

router.get('/admins', (request, response) => {

})

router.get('/events', async (request, response) => {
    let events = await groupService.getEvents(request.token.groupID)
    response.json(events)
})

module.exports = router