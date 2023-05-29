const OneToOneChat = require('../../controllers/chat/one-to-one')

const router = require('express').Router()


router.post('/create-conversation',OneToOneChat.createConversation)
router.post('/send-message',OneToOneChat.sendMessage)
router.get('/conversations',OneToOneChat.getConversations)
router.get('/messages',OneToOneChat.getMessages)


module.exports = router