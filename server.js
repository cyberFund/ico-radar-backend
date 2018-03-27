const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const DB = require('./db')
const logger = require('./app/helpers/logger.js')
const User = require('./models/user')
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
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  next()
})

// Authentication strategy dependencies and initialization
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose') 
const flash = require('connect-flash') 
const session = require('express-session')

const config = require('./config.json')
mongoose.connect(config.USERS_DB)

app.use(session({ secret: 'shhsecret' })) 
app.use(passport.initialize())  
app.use(passport.session())
app.use(flash())

require('./config/passport')(passport)

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = config.JWT_SECRET

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  // usually this would be a database call:
  const user = User.findOne({_id: jwt_payload.id}, (err, res) => {
    if (user) {
      next(null, user)
    } else {
      next(null, false)
    }
  })
})
passport.use(strategy)

// Constants that defines which port app will listen and which db (test of production) it will use
const port = process.env.PORT || 8000
const mode = process.env.NODE_ENV === 'test' ? 'mode_test' : 'mode_prod'

// Method for connecting to db. Callback function imports all existing routes from ./app/routes/index.js and intialize the app by app.listen method
DB.connect(mode, (err) => {
  if (err) return logger.error(`Error while connecting to db: \n${err}`)
  // Initializes all routes and pass an Express instance and db object to this routes
  require('./app/routes/index.js')(app, DB.getDB())
  app.listen(port, () => {
    logger.info(`Listen ${port}`)
  })
})

