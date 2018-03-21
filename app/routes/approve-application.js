const logger = require('../helpers/logger.js')
const gitApiMiddleware = require('../middlewares/git-api.js')

module.exports = (app, db) => {
  app.post('/approve-application', gitApiMiddleware, (req, res) => {
    res.send('Success')
    res.status(200)
    res.end()
  })
}