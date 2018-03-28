const logger = require('../helpers/logger')

// Defines a route that recieves project info in json format and stores it in MongoDB collection projectsInWork. If document with specified project name is already exist, sends an error response to client
module.exports = (app, db) => {
  // Define route
  app.post('/create-application', (req, res) => {
    console.log(req.body)
    // Tries to find a document with projects_name which is equal to specified in request body
    db.collection('projectsInWork').findOne({'project_name': req.body.project_name}, (err, searchRes) => {
      if (err) {
        logger.error('An error occured while searching project in projectsInWork: \n', err)
        return res.status(500)
      }
      // If there is such document, sends an error responce
      if (searchRes !== null) {
        res.status(400)
        res.json({message: 'Application with this project_name already exists'})
        res.end()
      } else {
        // Otherwise, saves document in projectsInWork collection and sends ok responce to client
        db.collection('projectsInWork').save(req.body, (err, added) => {
          if (err) {
            logger.error('An error occured while adding in projectsInWork: \n', err)
            return res.error('internal_error')
          }
          // If operation ends successfuly, sends 200 response
          logger.info(`Added new application. Project: ${req.body.project_name}; time: ${new Date().toISOString()}`)
          res.json({message: 'application_created'})
          res.status(200)
          res.end()
        })
      }
    })
  })
}