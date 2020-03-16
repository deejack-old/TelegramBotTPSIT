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

router.get('/', async (request, response) => {
    let users = await groupService.getUsers(request.token.groupID)
    let admins = await groupService.getAdmins(request.token.groupID)

    response.render('administration/users', { users: users, admins: admins })
})

module.exports = router