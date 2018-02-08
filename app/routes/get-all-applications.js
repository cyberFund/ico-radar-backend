const logger = require('../helpers/logger')

module.exports = (app, db) => {
  app.get('/get-all-applications', (req, res) => {
    db.collection('projectsInWork').find({}).toArray((err, searchRes) => {
      if (err) {
        logger.error('An error occured while searching project in projectsInWork: \n', err)
        return res.json({result: 'error', message: 'internal_error'})
      }
      res.json({result: 'ok', message: 'successfully_finded', applications: searchRes})
    })
  })
}