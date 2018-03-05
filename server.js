// require('dotenv').config()

const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const flash = require('connect-flash')
const morgan = require('morgan')
const session = require('express-session')
const DB = require('./db')
const logger = require('./app/helpers/logger.js')

const app = express()
// List of middlewares used in app
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({ secret: 'chaingearbackendsecret' }))
app.use('/static', express.static('static'))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(flash())

// Constants that defines which port app will listen and which db (test of production) it will use
const port = process.env.PORT || 8000
const mode = process.env.NODE_ENV === 'dev' ? 'mode_prod' : 'mode_test'

// Method for connecting to db. Callback function imports all existing routes from ./app/routes/index.js and intialize the app by app.listen method
DB.connect(mode, (err) => {
  if (err) return logger.error(`Error while connecting to db: \n${err}`)
  require('./app/routes/index.js')(app, DB.getDB(), passport)
  app.listen(port, () => {
    logger.info(`Listen ${port}`)
  })
})

