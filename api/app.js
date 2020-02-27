const express = require('express')
const app = express()

function start() {
    app.listen(3000, (error) => {
        if (error) throw error
        console.log('WEB API AVVIATE')
    })
}

exports.start = start