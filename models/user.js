const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const userSchema = mongoose.Schema({
  local: {
    username: String,
    password: String
  },
  twitter: {
    username: String,
    twitter_id: Number,
    displayName: String,
    profileInfo: String
  }
})
userSchema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password)
}
module.exports = mongoose.model('User', userSchema)