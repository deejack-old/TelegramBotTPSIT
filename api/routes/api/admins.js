const router = require('express').Router()
const groupService = require('../../services/groupService')

router.post('/promote', async (request, response) => {
    let id = request.body.id
    if (!id) {
        response.status(405)
        response.send('Insert the id!')
        return
    }
    let ok = await groupService.promote(id, request.token.groupID, request.user.id)
    response.status(ok ? 200 : 405)
    response.end()
})

router.post('/demote', async (request, response) => {
    let id = request.body.id
    if (!id) {
        response.status(405)
        response.send('Insert the id!')
        return
    }
    let ok = await groupService.demote(id, request.token.groupID, request.user.id)
    response.status(ok ? 200 : 405)
    response.end()
})

module.exports = router