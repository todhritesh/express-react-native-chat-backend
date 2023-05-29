const router = require('express').Router()
const oneToOne = require('./oneToOne')


router.use('/one-to-one',oneToOne)


module.exports = router