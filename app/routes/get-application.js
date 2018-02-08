const logger = require('../helpers/logger')

module.exports = (app, db) => {
  app.get('/get-application', (req, res) => {
    db.collection('projectsInWork').findOne({'project_name': req.body.project_name}, (err, searchRes) => {
      if (err) {
        logger.error('An error occured while searching project in projectsInWork: \n', err)
        return res.json({result: 'error', message: 'internal_error'})
      }
      if (searchRes === null) return res.json({result: 'error', message: 'cant_find'})
      res.json({result: 'ok', message: 'successfully_finded', application: searchRes})
    })
  })
}