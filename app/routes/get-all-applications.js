const logger = require('../helpers/logger')

// Define a route that fetches all applications from projectsInWork collection and sends it to a client
module.exports = (app, db) => {
  app.get('/get-all-applications', (req, res) => {
    db.collection('projectsInWork').find({}).toArray((err, searchRes) => {
      if (err) {
        // Logs an error message and sends 500 response
        logger.error('An error occured while searching project in projectsInWork: \n', err)
        return res.status(500)
      }
      // Filters all unvalid documents
      const validDocs = searchRes.filter((document) => document.project_name !== undefined)
      res.json({result: 'ok', message: 'successfully_finded', applications: validDocs})
      res.status(200)
      res.end()
    })
  })
}