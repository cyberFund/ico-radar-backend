const logger = require('../helpers/logger')

// Defines a route that recieves project info in json format and stores it in MongoDB collection projectsInWork. If document with specified project name is already exist, method replace it with new document
module.exports = (app, db) => {
  app.post('/create-application', (req, res) => {
    db.collection('projectsInWork').findOne({'project_name': req.body.project_name}, (err, searchRes) => {
      if (err) {
        logger.error('An error occured while searching project in projectsInWork: \n', err)
        return res.error('internal_error')
      }
      if (searchRes !== null) {
        db.collection('projectsInWork').replaceOne({project_name: req.body.project_name}, req.body, (err, updated) => {
          if (err) {
            logger.error('An error occured while updating projectsInWork: \n', err)
            return res.error('internal_error')
          }
          logger.info(`Application updated. Project: ${req.body.project_name}; time: ${new Date().toISOString()}`)
          res.json({result: 'ok', message: 'application_updated'})
          res.status(200)
          res.end()
        })
      } else {
        db.collection('projectsInWork').save(req.body, (err, added) => {
          if (err) {
            logger.error('An error occured while adding in projectsInWork: \n', err)
            return res.error('internal_error')
          }
          // Doing some additional steps...
          logger.info(`Added new application. Project: ${req.body.project_name}; time: ${new Date().toISOString()}`)
          res.json({result: 'ok', message: 'application_created'})
          res.status(200)
          res.end()
        })
      }
    })
  })
}