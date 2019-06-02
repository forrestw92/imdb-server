const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const routes = require('./routes')
const authProtect = require('./policies/auth.policy')
const db = require('./models')
const app = express()
require('dotenv').config()
const port = 3001 || process.env.PORT

/**
 * Change this to sync models to db
 */
const forceUpdate = false

app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


db.sequelize.sync({ force: forceUpdate }, function (error) {
  throw new Error({ msg: 'DB Model Sync Error', error })
})

// Auth protect all /movie routes
app.use('/movies/*', authProtect)

app.use(routes)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
