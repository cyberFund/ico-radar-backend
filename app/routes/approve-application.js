const passport = require('passport')
const ObjectId = require('mongodb').ObjectID
const logger = require('../helpers/logger.js')
const gitApiMiddleware = require('../middlewares/git-api.js')

const logError = (res, err) => {
  logger.error('An error occured while approving project: \n', err)
  return res.send('internal_error').status(500).end()
}

module.exports = (app, db) => {
  app.post('/approve-application', passport.authenticate('jwt', { session: false }), gitApiMiddleware, (req, res) => {
    db.collection('projectsInWork').deleteOne({project_name: req.body.project_name}, (err, result) => {
      delete req.body._id
      if (err) return logError(res, err)
      db.collection('approvedProjects').findOne({project_name: req.body.project_name}, (err, searchingRes) => {
        if (err) return logError(res, err)
        if (searchingRes !== null) {
          db.collection('approvedProjects').replaceOne({project_name: req.body.project_name}, req.body, (err, added) => {
            if (err) return logError(res, err)
            logger.info(`Project approved: ${req.body.project_name}`)
            return res.send('success').status(200).end()
          })
        } else {
          db.collection('approvedProjects').save(req.body, (err, added) => {
            logger.info(`Project approved: ${req.body.project_name}`)
            return res.send('success').status(200).end()
          })
        }
      })
    })
  })
}