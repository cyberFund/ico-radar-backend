const passport = require('passport')

module.exports = (app, db) => {
  app.get('/login/twitter', passport.authenticate('twitter'))

  app.get('/login/twitter/return', 
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    })
}