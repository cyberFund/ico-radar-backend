const logger = require('../helpers/logger')
var ObjectId = require('mongodb').ObjectID

// Defines a route for updating documents with projects info in projectsInWork collection. If it can't find document with specified project name, sends an error message to frontend
module.exports = (app, db) => {
  app.post('/update-application', (req, res) => {
    db.collection('projectsInWork').findOne({'_id': ObjectId(req.body._id)}, (err, searchRes) => {
      if (err) {
        logger.error('An error occured while searching project in projectsInWork: \n', err)
        return res.status(500)
      }
      if (searchRes === null) return res.json({result: 'error', message: 'cant_find'})
      	const id = req.body._id
      	delete req.body._id
      	db.collection('projectsInWork').replaceOne({'_id': ObjectId(id)}, req.body, (err, added) => {
          if (err) {
            logger.error('An error occured while updating in projectsInWork: \n', err)
            return res.status(500)
          }
          /* Doing some additional steps... */
          else {
        	  logger.info(`Application updated. Project: ${req.body.project_name}; time: ${new Date().toISOString()}`)
              res.json({result: 'ok', message: 'application_updated'})
              res.status(200)
        	}
      })
    })
  })
}
