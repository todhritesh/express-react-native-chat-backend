const router = require('express').Router()
const Friend = require('../controllers/friends')



router.post('/send-request',Friend.sendRequest)
router.post('/accept-request',Friend.acceptRequest)
router.patch('/reject-request',Friend.rejectRequest)
router.get('/',Friend.getFriends)
router.get('/non-friends',Friend.nonFriends)
router.get('/friend-requests',Friend.getFriendRequests)
router.get('/sent-requests',Friend.getSentRequests)
router.post('/cancel-sent-request',Friend.cancelSentRequest)


module.exports = router