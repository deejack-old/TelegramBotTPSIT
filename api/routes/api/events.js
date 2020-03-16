const router = require('express').Router()
const groupService = require('../../services/groupService')

router.delete('/ban', async (request, response) => {
    let id = request.body.id
    if (!id) {
        response.status(405)
        response.send('Insert the id!')
        return
    }
    let ok = await groupService.disableBan(id, request.token.groupID)
    response.status(ok ? 200 : 405)
    response.end()
})

router.delete('/warn', async (request, response) => {
    let id = request.body.id
    if (!id) {
        response.status(405)
        response.send('Insert the id!')
        return
    }
    let ok = await groupService.disableWarn(id, request.token.groupID)
    response.status(ok ? 200 : 405)
    response.end()
})

router.delete('/mute', async (request, response) => {
    let id = request.body.id
    if (!id) {
        response.status(405)
        response.send('Insert the id!')
        return
    }
    let ok = await groupService.disableMute(id, request.token.groupID)
    response.status(ok ? 200 : 405)
    response.end()
})

router.post('/ban', async (request, response) => {
    let id = request.body.id
    let tgID = request.body.userID
    if (!id || !tgID) {
        response.status(405)
        response.send('Insert the ids!')
        return
    }
    let ok = await groupService.ban(id, request.token.groupID, request.user.id, tgID)
    response.status(ok ? 200 : 405)
    response.end()
})

router.post('/kick', async (request, response) => {
    let id = request.body.id
    let tgID = request.body.userID
    if (!id || !tgID) {
        response.status(405)
        response.send('Insert the ids!')
        return
    }
    let ok = await groupService.kick(id, request.token.groupID, request.user.id, tgID)
    response.status(ok ? 200 : 405)
    response.end()
})

router.get('/', async (request, response) => {
    let events = await groupService.getEvents(request.token.groupID)
    response.render('administration/events', { bans: events.bans, kicks: events.kicks, mutes: events.mutes, warns: events.warns })
})

module.exports = router