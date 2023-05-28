const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const app = express()
const {connectDB} = require('./db')
const {PORT} = require('./config')
const errorHandler = require('./middlewares/error-handler')


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
