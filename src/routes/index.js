const router = require('express').Router()
const auth = require('./auth')
const home = require('./home')
const AuthMiddleware = require('../middlewares/auth')
const friend = require('./friend')


router.use('/auth',auth)
router.use('/home',AuthMiddleware,home)
router.use('/friends',AuthMiddleware,friend)




module.exports = router