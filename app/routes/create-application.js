const logger = require('../helpers/logger')

// Defines a route that recieves project info in json format and stores it in MongoDB collection projectsInWork. If document with specified project name is already exist, sends an error response to client
module.exports = (app, db) => {
  // Define route
  app.post('/create-application', (req, res) => {
    // Tries to find a document with projects_name which is equal to specified in request body
    db.collection('projectsInWork').findOne({'project_name': req.body.project_name}, (err, searchRes) => {
      if (err) {
        logger.error('An error occured while searching project in projectsInWork: \n', err)
        return res.error('internal_error')
      }
      // If there is such document, sends an error responce
      if (searchRes !== null) {
        res.send('Application with this project_name already exists')
        res.status(409)
        /*
        db.collection('projectsInWork').replaceOne({project_name: req.body.project_name}, req.body, (err, updated) => {
          if (err) {
            logger.error('An error occured while updating projectsInWork: \n', err)
            return res.error('internal_error')
          }
          logger.info(`Application updated. Project: ${req.body.project_name}; time: ${new Date().toISOString()}`)
          res.json({result: 'ok', message: 'application_updated'})
          res.status(200)
          res.end()
        })*/
      } else {
        // Otherwise, saves document in projectsInWork collection and sends ok responce to client
        db.collection('projectsInWork').save(req.body, (err, added) => {
          if (err) {
            logger.error('An error occured while adding in projectsInWork: \n', err)
            return res.error('internal_error')
          }
          /* Doing some additional steps... */
          logger.info(`Added new application. Project: ${req.body.project_name}; time: ${new Date().toISOString()}`)
          res.json({result: 'ok', message: 'application_created'})
          res.status(200)
          res.end()
        })
      }
    })
  })
}