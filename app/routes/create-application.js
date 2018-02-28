const logger = require('../helpers/logger')

module.exports = (app, db) => {
  app.post('/create-application', (req, res) => {
    db.collection('projectsInWork').findOne({'project_name': req.body.project_name}, (err, searchRes) => {
      if (err) {
        logger.error('An error occured while searching project in projectsInWork: \n', err)
        return res.json({result: 'error', message: 'internal_error'})
      }
      if (searchRes !== null) {
        db.collection('projectsInWork').save({project_name: req.body.project_name}, req.body, (err, updated) => {
          if (err) {
            logger.error('An error occured while updating projectsInWork: \n', err)
            return res.json({result: 'error', message: 'internal_error'})
          }
          logger.info(`Application updated. Project: ${req.body.project_name}; time: ${new Date().toISOString()}`)
          res.json({result: 'ok', message: 'application_updated'})
          res.end()
        })
      } else {
        db.collection('projectsInWork').save(req.body, (err, added) => {
          if (err) {
            logger.error('An error occured while adding in projectsInWork: \n', err)
            return res.json({result: 'error', message: 'internal_error'})
          }
          // Doing some additional steps...
          logger.info(`Added new application. Project: ${req.body.project_name}; time: ${new Date().toISOString()}`)
          res.json({result: 'ok', message: 'application_created'})
          res.end()
        })
      }
    })
  })
}