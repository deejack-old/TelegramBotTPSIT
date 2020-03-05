const router = require('express').Router()
const loginService = require('../services/loginService')

router.get('/', (request, response) => {
    response.render('login')
})

router.post('/', async (request, response) => {
    const { username, group, password } = request.body
    let successful = await loginService.checkLogin(group, username, password)
    if (successful) {
        let authToken = loginService.generateToken(username, group)
        response.cookie('AuthToken', authToken)
        response.redirect('/administration')
    } else {
        response.render('login', {
            message: 'Username, id gruppo o password non corretti',
            messageClass: 'alert-danger'
        })
    }
})

module.exports = router