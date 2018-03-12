const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const DB = require('./db')
const logger = require('./app/helpers/logger.js')

// Initialize an Express instance
const app = express()

// List of middlewares used in app
app.use(bodyParser.json())
app.use(cookieParser())
// Middleware that defines folder containing static files and public route to them
app.use('/static', express.static('static'))
// Midlleware that enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// Constants that defines which port app will listen and which db (test of production) it will use
const port = process.env.PORT || 8000
const mode = process.env.NODE_ENV === 'dev' ? 'mode_prod' : 'mode_test'

// Method for connecting to db. Callback function imports all existing routes from ./app/routes/index.js and intialize the app by app.listen method
DB.connect(mode, (err) => {
  if (err) return logger.error(`Error while connecting to db: \n${err}`)
  // Initializes all routes and pass an Express instance and db object to this routes
  require('./app/routes/index.js')(app, DB.getDB(), passport)
  app.listen(port, () => {
    logger.info(`Listen ${port}`)
  })
})

