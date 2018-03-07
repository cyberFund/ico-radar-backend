const logger = require('../helpers/logger')

module.exports = (app, db) => {
  app.post('/move-rejected-approved', (req, res) => {
    db.collection('rejectedProjects').findOne({project_name: req.body.project_name}, (err, searchRes) => {
      if (err) {
        logger.error('An error occured while searching rejectedProjects: \n', err)
        return res.json({result: 'error', message: 'internal_error'})
      }
      if (searchRes === null) {
        return res.json({result: 'error', message: 'not_found'})
      }
      db.collection('approvedProjects').findOne({project_name: req.body.project_name}, (err, searchingRes) => {
        if (err) {
          logger.error('An error occured while searching rejectedProjects: \n', err)
          return res.json({result: 'error', message: 'internal_error'})
        }
        if (searchingRes === null) {
          db.collection('approvedProjects').save(req.body, (err, added) => {
            if (err) {
              logger.error('An error occured while adding to approvedProjects: \n', err)
              return res.json({result: 'error', message: 'internal_error'})
            }
            logger.info(`Application moved from rejected to approved. Project: ${req.body.project_name}; time: ${new Date().toISOString()}`)
            res.json({result: 'ok', message: 'moved_approved'})
          })
        }
      })
    })
  })
}