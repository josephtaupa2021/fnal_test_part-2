const express = require('express')
const cookieParser = require('cookie-parser')
const routes = require('./routes/routes.js')
const app = express()

app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/static'))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

app.use(routes)

let PORT = process.env.PORT || 9090;
app.listen(9090, console.log(`Listening at port ${PORT}`));