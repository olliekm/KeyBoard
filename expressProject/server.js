const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const subscribersRouter = require('./routes/subscribers')
const uploadRouter = require('./routes/uploads')

const conn1 = mongoose.createConnection(process.env.USERDB, {useNewUrlParser: true})

const conn2 = mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.on('open', () => console.log("Connected"))

app.use(express.json({limit: '200mb'}))
app.use(cors())
app.use('/subscribers', subscribersRouter)
app.use('/users', uploadRouter)









  app.listen(3000, () => {
    console.log("Server Started")
})