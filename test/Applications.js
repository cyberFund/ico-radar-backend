process.env.NODE_ENV = 'test'

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
  /*before(done => {
    DB.connect(DB.MODE_TEST, done)
  })*/
  beforeEach(done => {
    DB.connect(DB.MODE_TEST, () => DB.drop(err => err ? done(err) : done()))
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
  it('it should update an existing application', done => {
    const updatedProject = {
      creator_email: 'other_address@gmail.com',
      project_name: 'Polkadot',
      timestamp: new Date(),
      project_info: {}
    }
    chai.request(`http://localhost:${port}`)
      .post('/create-application')
      .send(project)
      .end((err, res) => {
        chai.request(`http://localhost:${port}`)
          .post('/update-application')
          .send(updatedProject)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('message').eql('application_updated')
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
  it('it should get an application with specified project_name', done => {
    chai.request(`http://localhost:${port}`)
      .post('/create-application')
      .send(project)
      .end((err, res) => {
        chai.request(`http://localhost:${port}`)
          .get('/get-application')
          .send({project_name: 'Polkadot'})
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
})
