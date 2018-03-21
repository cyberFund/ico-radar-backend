const _ = require('lodash')
const github = require('octonode')
const tomlify = require('tomlify-j0.4')
const config = require('../../config.json')
const convert = require('../helpers/new_to_old.js')
const logger = require('../helpers/logger.js')
const GithubApi = require('../helpers/github-api.js')
const Base64 = require('js-base64').Base64

const owner = config.owner,
  repo = config.repo
  br = config.branch

const gitApi = new GithubApi(owner, config.git_token)

const client = github.client(config.git_token)
const mainRepo = client.repo(`${owner}/${repo}`)
const forkRepo = client.repo(`goloschaingear/${repo}`)

const createFile = (repoObj, path, message, content, branch) => {
  return new Promise((resolve, reject) => {
    repoObj.createContents(path, message, content, branch, (err, res) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
}
const updateFile = (repoObj, path, message, content, branch, sha) => {
  return new Promise((resolve, reject) => {
    repoObj.updateContents(path, message, content, sha, branch, (err, res) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
}

module.exports = (req, res, next) => {
  // console.log(req.body.project_info)
  // req.body.project_info = JSON.parse(req.body.project_info)

  const tomlFile = tomlify.toToml(req.body.project_info, {space: 2})

  const path = `sources/${req.body.project_name.replace(/[\W]/g, '')}/${req.body.project_name.replace(/[\W]/g, '')}.toml`
  createFile(forkRepo, path, `Add: ${req.body.project_name}`, tomlFile, br)
    .then(result => {
      logger.info(`File was committed: ${path}`)
      return gitApi.getBlobSha('goloschaingear', repo, br, 'chaingear.json')
    }).then(blob => {
      let chaingear = JSON.parse(Base64.decode(blob.content))
      const oldStructure = convert(req.body.project_info)
      const m = _.findIndex(chaingear, (o) => o.system === req.body.project_name)
      chaingear.splice(m, 1, oldStructure)
      chaingear = chaingear.filter(project => project.system!=='')
      chaingear = _.uniqBy(chaingear, 'system')
      chaingear = _.sortBy(chaingear, ['system'])
      const fileStr = JSON.stringify(chaingear, null, 4)
      return updateFile(forkRepo, 'chaingear.json', `Update chaingear.json: Add ${req.body.project_name}`, fileStr, br, blob.sha)
    }).then(updated => {
      return logger.info(`chaingear.json was updated; time: ${new Date()}`)
    }).catch(err => console.log(err))

}