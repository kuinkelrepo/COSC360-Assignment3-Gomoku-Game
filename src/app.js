const express = require('express')
require('dotenv').config();
require('./db/config')
const cors = require('cors')
const userRouter = require('./routes/User')
const gameRouter = require('./routes/Game')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

// Ruoters
app.use(userRouter)
app.use(gameRouter)

// app.get('/', (req, res) => {
//   try {
//     res.status(200).sendFile(path.join(__dirname + '/..//public/index.html'));
//   } catch (error) {
//     throw new Error(error)
//   }
// })

app.use((error, req, res, next) => {
  console.error(error.stack)
  res.status(error.status || 500)
  res.json({
    error: {
      status: error.status || 500,
      message: error.message
    }
  })
})

module.exports = app