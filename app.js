require('dotenv').config()

const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const bodyParser = require('body-parser')
const path = require('path')
// const rateLimiter = require('express-rate-limit')

const express = require('express')
const app = express()

const port = process.env.PORT || 3000
const connectDB = require('./db/connectDB')

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

const authenticateUser = require('./middleware/authentication')

// app.set('trust proxy', 1)
// app.use(
//     rateLimiter({
//         windowMs: 15 * 60 * 1000,
//         max: 100
//     })
// )
// app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(helmet())
app.use(cors())
// {
//     origin: 'http://localhost:3000',
//         methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//             allowedHeaders: ['Content-Type', 'Authorization'],
//                 credentials: true
// }
app.use(xss())

app.use('/api/v1/authRouter', authRouter)
app.use('/api/v1/jobsRouter', authenticateUser, jobsRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        })
    } catch (err) {
        console.log(err)
    }
}

//use 'npm start' to start
start()
