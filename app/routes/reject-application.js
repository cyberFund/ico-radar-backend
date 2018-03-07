const logger = require('../helpers/logger')

module.exports = (app, db) => {
  app.post('/reject-application', (req, res) => {
    db.collection('projectsInWork').deleteOne({'project_name': req.body.project_name}, (err, searchRes) => {
      if (err) {
        logger.error('An error occured while searching project in projectsInWork: \n', err)
        return res.json({result: 'error', message: 'internal_error'})
      }
      db.collection('rejectedProjects').findOne({project_name: req.body.project_name}, (err, searchingRes) => {
        if (err) {
          logger.error('An error occured while searching project in rejectedProjects: \n', err)
          return res.json({result: 'error', message: 'internal_error'})
        }
        db.collection('rejectedProjects').save(req.body, (err, added) => {
          if (err) {
            logger.error('An error occured while adding in rejectedProjects: \n', err)
            return res.json({result: 'error', message: 'internal_error'})
          }
          // Doing some additional steps...
          logger.info(`Application rejected. Project: ${req.body.project_name}; time: ${new Date().toISOString()}`)
          res.json({result: 'ok', message: 'application_rejected'})
        })
      })
    })
  })
}