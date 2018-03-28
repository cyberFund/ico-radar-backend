const User = require('../../models/user')
var jwt = require('jsonwebtoken')
const config = require('../../config.json')

module.exports = (app, db) => {
  app.post('/login', (req, res) => {
    // usually this would be a database call:
    User.findOne({ 'local.username':  req.body.username }, (err, user) => {
      if (err) {
        console.log(err)
        return
      }
      if(!user){
        res.status(401).json({message:"no such user found"});
      } else if(!user.validPassword(req.body.password)) {
        res.status(401).json({message:"passwords did not match"})
      } else {
        // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
        var payload = {id: user._id};
        var token = jwt.sign(payload, config.JWT_SECRET)
        res.json({message: "ok", token: token})
      }
    })
  })
}