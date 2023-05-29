const express = require('express')
const cors = require('cors')
const routes = require('./src/routes')
const app = express()
const {connectDB} = require('./src/db')
const {PORT} = require('./src/config')
const errorHandler = require('./src/middlewares/error-handler')
const http = require('http');
const {Server} = require('socket.io');
const sockets = require('./src/socket')


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/api',routes)
app.use(errorHandler)

const runServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => console.log(`Server runnig on ${PORT}`))

        const io = new Server(server, {
            cors: {
                origin: "*",
            },
        });
        sockets(io)


    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

runServer()
