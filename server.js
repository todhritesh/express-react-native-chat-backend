const express = require('express')
const cors = require('cors')
const routes = require('./src/routes')
const app = express()
const {connectDB} = require('./src/db')
const {PORT} = require('./src/config')
const errorHandler = require('./src/middlewares/error-handler')


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/api',routes)
app.use(errorHandler)

const runServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => console.log(`Server runnig on ${PORT}`))

    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

runServer()
