const express = require('express')
const app = express()
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const loginService = require('./services/loginService')
const userService = require('../database/services/users')

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static('api/static'))

app.engine('hbs', handlebars({
    extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views');

app.use(async (request, response, next) => {
    let token = request.cookies['AuthToken']
    let authToken = await loginService.getAuthToken(token)
    request.token = authToken
    next()
})

app.use('/', require('./routes/login'))
app.use('/login', require('./routes/login'))
app.use('/administration', require('./routes/administration'))

function start() {
    app.listen(3000, (error) => {
        if (error) throw error
        console.log('WEB API AVVIATE')
    })
}

exports.start = start