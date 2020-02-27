const express = require('express')
const app = express()

app.listen(3000, (error) => {
    if (error) throw error
    console.log('API avviate')
})