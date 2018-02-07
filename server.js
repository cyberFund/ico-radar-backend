require('dotenv').config()
// process.env.NODE_ENV = 'dev'

const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const DB = require('./db')
const logger = require('./app/helpers/logger.js')

const app = express()
app.use(bodyParser.json())
app.use('/static', express.static('static'))

const port = process.env.PORT || 8000
const mode = process.env.NODE_ENV === 'dev' ? 'mode_prod' : 'mode_test'
const state = {
  db: null,
  mode: null
}

DB.connect(mode, (err) => {
  if (err) return logger.error(`Error while connecting to db: \n${err}`)
  require('./app/routes/index.js')(app, database)
  app.listen(port, () => {
    logger.info(`Listen ${port}`)
  })
})
/* MongoClient.connect(DB.url, (err, database) => {
  if (err) return logger.error(`Error while connecting to db: \n${err}`)
  require('./app/routes/index.js')(app, database)
  app.listen(port, () => {
    logger.info(`Listen ${port}`)
  })
}) */
