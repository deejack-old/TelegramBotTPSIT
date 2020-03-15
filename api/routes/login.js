const router = require('express').Router()
const loginService = require('../services/loginService')

router.get('/', (request, response) => {
    response.render('login')
})

router.post('/', async (request, response) => {
    const { userID, group, password } = request.body
    let successful = await loginService.checkLogin(group, userID, password)
    console.log('Successful: ' + successful)
    if (successful) {
        let authToken = loginService.generateToken(userID, group)
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