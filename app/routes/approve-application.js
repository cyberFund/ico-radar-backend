const logger = require('../helpers/logger')

module.exports = (app, db) => {
  app.post('/approve-application', (req, res) => {
    db.collection('projectsInWork').deleteOne({'project_name': req.body.project_name}, (err, searchRes) => {
      if (err) {
        logger.error('An error occured while searching project in projectsInWork: \n', err)
        return res.json({result: 'error', message: 'internal_error'})
      }
      db.collection('approvedProjects').findOne({project_name: req.body.project_name}, (err, searchingRes) => {
        if (err) {
          logger.error('An error occured while searching project in approvedProjects: \n', err)
          return res.json({result: 'error', message: 'internal_error'})
        }
        if (searchingRes !== null) {
          db.collection('approvedProjects').save({project_name: req.body.project_name}, req.body, (err, added) => {
            if (err) {
              logger.error('An error occured while adding in approvedProjects: \n', err)
              return res.json({result: 'error', message: 'internal_error'})
            }
            // Doing some additional steps...
            res.json({result: 'ok', message: 'application_approved'})
          })
        } else {
          db.collection('approvedProjects').save(req.body, (err, added) => {
            if (err) {
              logger.error('An error occured while adding in approvedProjects: \n', err)
              return res.json({result: 'error', message: 'internal_error'})
            }
            // Doing some additional steps...
            logger.info(`Application approved. Project: ${req.body.project_name}; time: ${new Date().toISOString()}`)
            res.json({result: 'ok', message: 'application_approved'})
          })
        }
      })
    })
  })
}