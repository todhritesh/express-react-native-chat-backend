const router = require('express').Router()
const auth = require('./auth')
const home = require('./home')
const AuthMiddleware = require('../middlewares/auth')
const friend = require('./friend')
const chat = require('./chat')


router.use('/auth',auth)
router.use('/home',AuthMiddleware,home)
router.use('/friends',AuthMiddleware,friend)
router.use('/chat',AuthMiddleware,chat)




module.exports = router