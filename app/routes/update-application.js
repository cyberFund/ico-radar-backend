const logger = require('../helpers/logger')
var ObjectId = require('mongodb').ObjectID

module.exports = (app, db) => {
  app.post('/update-application', (req, res) => {
    db.collection('projectsInWork').findOne({'_id': ObjectId(req.body._id)}, (err, searchRes) => {
      if (err) {
        logger.error('An error occured while searching project in projectsInWork: \n', err)
        return res.json({result: 'error', message: 'internal_error'})
      }
      if (searchRes === null) return res.json({result: 'error', message: 'cant_find'})
      	console.log(req.body.project_info.blockchain.headline)
	const id = req.body._id
	console.log(id)
	delete req.body._id
	db.collection('projectsInWork').replaceOne({'_id': ObjectId(id)}, req.body, (err, added) => {
        if (err) {
          logger.error('An error occured while updating in projectsInWork: \n', err)
          return res.json({result: 'error', message: 'internal_error'})
        }
        // Doing some additional steps...
        else {
	  logger.info(`Application updated. Project: ${req.body.project_name}; time: ${new Date().toISOString()}`)
          res.json({result: 'ok', message: 'application_updated'})
	}
      })
    })
  })
}
