const createApplication = require('./create-application')
const updateApplication = require('./update-application')
const getApplication = require('./get-application')
const getAllApplications = require('./get-all-applications')

module.exports = (app, db) => {
  createApplication(app, db)
  updateApplication(app, db)
  getApplication(app, db)
  getAllApplications(app, db)
}