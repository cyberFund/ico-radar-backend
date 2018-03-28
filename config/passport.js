const LocalStrategy = require('passport-local').Strategy
// const TwitterTokenStrategy = require('passport-twitter-token')
const TwitterStrategy = require('passport-twitter')
const User = require('../models/user')
const config = require('../config.json')

module.exports = (passport) => {  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  },
  (req, username, password, done) => {
    process.nextTick(() => {
      User.findOne({ 'local.username': req.body.username }, (err, user) => {
        if (err)
            return done(err)
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That username is already in use.'))
        } else {
          var newUser = new User()
          newUser.local.username = username
          newUser.local.password = newUser.generateHash(password)
          newUser.save((err) => {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));
  // Local login strategy; used to login with username and password
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  (req, email, password, done) => {
    // console.log(req)
    User.findOne({ 'local.username':  req.body.username }, (err, user) => {
      if (err)
          return done(err);
      if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
      if (!user.validPassword(req.body.password))
          return done(null, false, req.flash('loginMessage', 'Wrong password.'));
      return done(null, user);
    });
  }))

  passport.use(new TwitterStrategy({
      consumerKey: config.TWITTER_CONSUMER_KEY,
      consumerSecret: config.TWITTER_CONSUMER_SECRET,
      callbackURL: config.CALLBACK_URL
    },
    (token, tokenSecret, profile, done) =>  {
      User.findOne({'twitter.twitter_id': profile.id}, (err, user) => {
        if (err) {
          return done(err)
        } else if (!user) {
          const newUser = new User()
          newUser.twitter.username = profile.username
          newUser.twitter.displayName = profile.displayName,
          newUser.twitter.twitter_id = profile.id
          newUser.profileInfo = profile._raw
          newUser.save(err => {
            if (err) throw(err)
            return done(null, newUser)
          })
        } else {
          return done(null, user)
        }
      })
    }
  ))
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
  /*
  passport.use(new TwitterTokenStrategy({
      consumerKey: config.TWITTER_CONSUMER_KEY,
      consumerSecret: config.TWITTER_CONSUMER_SECRET
    }, (token, tokenSecret, profile, done) => {
      User.findOrCreate({ twitterId: profile.id }, (error, user) => {
        return done(error, token);
      });
    }
  ));*/
}