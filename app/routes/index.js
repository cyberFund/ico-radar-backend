const createApplication = require('./create-application')
const updateApplication = require('./update-application')
const getApplication = require('./get-application')
const getAllApplications = require('./get-all-applications')
const approveApplication = require('./approve-application')
const rejectApplication = require('./reject-application')
const moveApproved = require('./move-rejected-approved')

module.exports = (app, db) => {
  createApplication(app, db)
  updateApplication(app, db)
  getApplication(app, db)
  getAllApplications(app, db)
  approveApplication(app, db)
  rejectApplication(app, db)
  moveApproved(app, db)
}