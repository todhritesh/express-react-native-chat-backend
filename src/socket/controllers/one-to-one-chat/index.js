const OneToOneChat = require('./OneToOneChatController')

module.exports = function initializeOneToOneChat(io,socket) {
    const oneToOneChat = new OneToOneChat(socket)

    socket.on('one_to_one_join_room',oneToOneChat.one_to_one_join_room)
    socket.on('one_to_one_send_message',oneToOneChat.one_to_one_send_message)
    socket.on('one_to_one_typing_started',oneToOneChat.one_to_one_typing_started)
    socket.on('one_to_one_typing_stopped',oneToOneChat.one_to_one_typing_stopped)
    
}