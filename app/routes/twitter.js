const passport = require('passport')
var jwt = require('jsonwebtoken')
const config = require('../../config.json')

module.exports = (app, db) => {
  app.get('/login/twitter', passport.authenticate('twitter'))

  app.get('/login/twitter/return', 
    passport.authenticate('twitter', { failureRedirect: '/login'}), 
    function(req, res) {
      // res.redirect('/');
      //console.log('req_user', req.user)
      const payload = {twitter_id: req.user.twitter.twitter_id}
      const token = jwt.sign(payload, config.JWT_SECRET)
      res.json({message: "ok", token: token})
    })
}
// , successRedirect: '/successful-twitter'