const logger = require('../helpers/logger')

// Define a route that fetches all applications from projectsInWork collection and sends it to a client
module.exports = (app, db) => {
  app.get('/get-all-applications', (req, res) => {
    db.collection('projectsInWork').find({}).toArray((err, searchRes) => {
      if (err) {
        logger.error('An error occured while searching project in projectsInWork: \n', err)
        return res.status(500)
      }
      res.json({result: 'ok', message: 'successfully_finded', applications: searchRes})
    })
  })
}