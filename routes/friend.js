const router = require('express').Router()
const Friend = require('../controllers/friends')



router.post('/send-request',Friend.sendRequest)
router.post('/accept-request',Friend.acceptRequest)
router.patch('/reject-request',Friend.rejectRequest)
router.get('/',Friend.getFriends)


module.exports = router