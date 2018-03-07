const _ = require('lodash')
const github = require('octonode')
const tomlify = require('tomlify-j0.4')
const config = require('../../config.json')
const convert = require('../helpers/new_to_old.js')
const GithubApi = require('../helpers/github-api.js')

const owner = config.owner,
  repo = config.repo
  br = config.branch

const client = github.client(config.git_token)
const mainRepo = client.repo(`${owner}/${repo}`)
const forkRepo = client.repo(`golos-chaingear/${repo}`)
const gitApi = new GithubApi(owner, config.git_token)
const createFile = (repoObj, path, message, content, branch) => {
  return new Promise(resolve, reject) => {
    repoObj.createContents(path, message, content, branch, (err, res) => {
      if (err) reject(err)
      else resolve(res)
    })
  }
}

module.exports = (req, res, next) => {
  let currentCgSha = ''
  const tomlFile = tomlify.toToml(req.body.project_info, {space: 2})
  const path = `sources/${req.body.project_name.replace(/[\W]/g, '')}/${req.body.project_name.replace(/[\W]/g, '')}.toml`
  createFile(forkRepo, path, `Add: ${req.body.project_name}`, tomlFile, 'gh-pages')
    .then(result => {
      return gitApi.getBlobSha(owner, repo, br, 'chaingear.json')
    }).then(blob => {
      currentCgSha = blob.sha
    })
}