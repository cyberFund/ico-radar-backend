const MongoClient = require('mongodb').MongoClient
const async = require('async')
const config = require('./config.json')

const state = {
  db: null,
  mode: null
}
// URIs for db connection
const PROD_URI = config.DB_PROD_URI,
  TEST_URI = config.DB_TEST_URI

// variables that specifies app mode: test or production
exports.MODE_TEST = 'mode_test'
exports.MODE_PROD = 'mode_prod'

// This method creates an connection to db and saves it in local state.db variable
exports.connect = (mode, done) => {
  if (state.db) return done()
  const uri = (mode === exports.MODE_TEST) ? TEST_URI : PROD_URI
  MongoClient.connect(uri, (err, client) => {
    if (err) return done(err)
    state.db = client.db((mode === exports.MODE_TEST) ? 'chaingear-test-db' : 'chaingear')
    state.mode = mode
    done()
  })
}
// This method returns db connection object from local state.db variable
exports.getDB = () => state.db

// Removes all documents from all collections. Created only for testing purposes, don't use it in production
exports.drop = done => {
  if (!state.db) return done()
  state.db.collections((err, collections) => {
    async.each(collections, (collection, cb) => {
      if (collection.collectionName.indexOf('system') === 0) {
        return cb()
      }
      collection.remove(cb)
    }, done)
  })
}
