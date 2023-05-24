const router = require('express').Router()
const auth = require('./auth')
const home = require('./home')
const AuthMiddleware = require('../middlewares/auth')


router.use('/auth',auth)
router.use('/home',AuthMiddleware,home)




module.exports = router