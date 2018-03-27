const createApplication = require('./create-application')
const getApplication = require('./get-application')
const getAllApplications = require('./get-all-applications')
const approveApplication = require('./approve-application')
const login = require('./login')
const twitter = require('./twitter')

// Calls all currently used routes. This function is used in server.js to initialize routes
module.exports = (app, db, passport) => {
  createApplication(app, db)
  getApplication(app, db)
  getAllApplications(app, db)
  approveApplication(app, db)
  login(app, db, passport)
  twitter(app, db)
}