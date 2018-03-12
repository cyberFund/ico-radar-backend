const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../server.js')
const DB = require('../db.js')

const port = process.env.PORT || 8000
chai.use(chaiHttp)

describe('Applications CRUD cycle test', () => {
  const project = {
    creator_email: 'adress@gmail.com',
    project_name: 'Polkadot',
    timestamp: new Date(),
    project_info: {
      blockchain: {}
    }
  }
  const emptyProject = {
    project_name: 'Polkadot'
  }
  before(done => {
    DB.connect(DB.MODE_TEST, done)
  })
  beforeEach(done => {
    DB.drop(err => err ? done(err) : done())
  })
  it('it should create new application', done => {
    chai.request(`http://localhost:${port}`)
      .post('/create-application')
      .send(project)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('message').eql('application_created')
        done()
      })
  })
  it('it should return error message after trying to create new application', done => {
    chai.request(`http://localhost:${port}`)
      .post('/create-application')
      .send(project)
      .end((err, res) => {
        chai.request(`http://localhost:${port}`)
          .post('/create-application')
          .send(project)
          .end((err, res) => {
            res.should.have.status(400)
            res.body.should.be.a('object')
            res.body.should.have.property('message').eql('Application with this project_name already exists')
            done()
          })
      })
  })
  it('it should return all applications', done => {
    chai.request(`http://localhost:${port}`)
      .get('/get-all-applications')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.applications.should.be.a('array')
        res.body.applications.length.should.be.eql(0)
        done()
      })
  })
  it('it should return only applications with specified project_info', done => {
    chai.request(`http://localhost:${port}`)
      .post('/create-application')
      .send(emptyProject)
      .end((err, res) => {
        chai.request(`http://localhost:${port}`)
          .get('/get-all-applications')
          .end((err, res) => {
            res.should.have.status(200)
            res.body.applications.should.be.a('array')
            res.body.applications.length.should.be.eql(0)
            done()
          })
        })
  })
  it('it should get an application with specified project_name', done => {
    chai.request(`http://localhost:${port}`)
      .post('/create-application')
      .send(project)
      .end((err, res) => {
        chai.request(`http://localhost:${port}`)
          .get('/get-application/Polkadot')
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('message').eql('successfully_finded')
            res.body.application.should.have.property('project_name').eql('Polkadot')
            res.body.application.should.have.property('creator_email').eql('adress@gmail.com')
            res.body.application.project_info.should.be.a('object')
            done()
          }) 
      })
  })
  it('it should return an error after trying to get application that doesnt exist', done => {
    chai.request(`http://localhost:${port}`)
      .post('/create-application')
      .send(project)
      .end((err, res) => {
        chai.request(`http://localhost:${port}`)
          .get('/get-application/Polkadot1')
          .end((err, res) => {
            res.should.have.status(404)
            res.body.should.be.a('object')
            res.body.should.have.property('message').eql('Application with specified project_name does not exist')
            done()
          }) 
      })
  })
})
