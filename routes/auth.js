const router = require('express').Router()
const Auth = require('../controllers/auth')
const UserExistMiddleware = require('../middlewares/user-exist')
const AuthMiddleware = require('../middlewares/auth')



router.post('/signup',UserExistMiddleware,Auth.singup)
router.post('/login',Auth.login)
router.post('/auth-check',AuthMiddleware,Auth.authCheck)


module.exports = router