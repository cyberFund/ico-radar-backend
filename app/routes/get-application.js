const logger = require('../helpers/logger')

module.exports = (app, db) => {
  // Defines a route that recives a project name in URL 
  app.get('/get-application/:project_name', (req, res) => {
    // Search for a document with such project name
    db.collection('projectsInWork').findOne({'project_name': req.params.project_name}, (err, searchRes) => {
      if (err) {
        // Logs an error message and sends 500 response
        logger.error('An error occured while searching project in projectsInWork: \n', err)
        return res.status(500)
      }
      if (searchRes === null) {
        // Send a message and 404 response
        res.send('Application with such project_name does not exist')
        res.status(404)
        return res.end()
      }
      // If search ends successfully it sends json object with search results and set 200 status to response
      res.json({result: 'ok', message: 'successfully_finded', application: searchRes})
      res.status(200)
      res.end()
    })
  })
}