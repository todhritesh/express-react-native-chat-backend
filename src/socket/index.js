const initializeOneToOneChat = require('./controllers/one-to-one-chat')

module.exports = function sockets (io) {
    io.on('connection', socket => {
        console.log('socket connection')
        initializeOneToOneChat(io,socket)
    })
}