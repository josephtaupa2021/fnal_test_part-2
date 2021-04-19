const { User, Message, Session } = require('../models/models.js')
const jwt = require('jsonwebtoken')
const { Router } = require('express')
const { v4: uuidv4 } = require('uuid')
const router = Router()

router.get('/', async function (req, res) {
    let messages = await Message.findAll({ include: User }) // { include: User} - Message.belongsTo(User)
    let data = { messages }
    res.render('index.ejs', data)
})

router.get('/createUser', async function (req, res) { res.render('createUser.ejs') })
router.post('/createUser', async function (req, res) {
    let { username, password } = req.body

    try {
        await User.create({
            username,
            password,
            role: "user"
        })
    } catch (e) {
        console.log(e)
    }
    res.redirect('/login')
})

router.get('/login', function (req, res) { res.render('login') })
router.post('/login', async function (req, res) {
    let { username, password } = req.body
    let id = uuidv4();

    try {
        // if-else block declared inside try block
        let user = await User.findOne({ where: { username } })
        if (user !== undefined && user.password === password) { // Condition: user !== undefined 

            let data = {
                username: username,
                role: user.role
            }
            const session = await Session.create({
                user: user.username,
                sessionID: id,
                timeOfLogin: Date.now(),
            });
            console.log(session.toJSON());

            let token = jwt.sign(data, "theSecret")
            res.cookie("token", token)
            console.log('ACCESS_TOKEN', token)

            let DECODED_TOKEN = jwt.decode(token)
            console.log('DECODED TOKEN', DECODED_TOKEN)

            res.redirect('/message')
        } else {
            res.redirect('/error')
        }
    } catch (e) {
        console.log(e)
    }
})

router.get('/message', async function (req, res) {
    let token = req.cookies.token

    if (token) {
        res.render('message')
    } else {
        res.render('login')
    }
})

router.post('/message', async function (req, res) {
    let { token } = req.cookies
    let { content } = req.body

    if (token) {
        let payload = await jwt.verify(token, "theSecret")
        let user = await User.findOne({
            where: { username: payload.username }
        })

        let msg = await Message.create({
            content,
            creator: user.username, // initialized for <%= message.dataValues.creator %>
            userId: user.id
        })
        console.log(msg.toJSON())
        res.redirect('/')
    } else {
        res.redirect('/login')
    }
})

router.get('/error', function (req, res) {
    res.sendStatus(404).redirect('/')
})

router.all('*', function (req, res) {
    res.sendStatus(404).redirect('/')
})

module.exports = router