process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../server.js')
const DB = require('../db.js')

const port = process.env.PORT || 8000
chai.use(chaiHttp)

describe('Applications CRUD cycle test', () => {
  before(done => {
    DB.connect(DB.MODE_TEST, done)
  })
  beforeEach(done => {
    DB.drop(err => err ? done(err) : done())
  })
  it('it should create new application', done => {
    const project = {
      creator_email: 'adress@gmail.com',
      timestamp: new Date(),
      project_info: {}
    }
    chai.request(`http://localhost:${port}`)
      .post('/create-application')
      .send(project)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('message').eql('Application successfully created')
        req.body.application.should.have.property('creator_email')
        req.body.application.should.have.property('timestamp')
        req.body.application.should.have.property('project_info')
      })
  })
})
