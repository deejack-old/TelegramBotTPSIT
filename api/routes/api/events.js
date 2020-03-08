const router = require('express').Router()
const groupService = require('../../services/groupService')

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

router.get('/', async (request, response) => {
    let events = await groupService.getEvents(request.token.groupID)
    response.json(events)
})

module.exports = router