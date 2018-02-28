const request = require('request')

module.exports = class GithubApi {
  constructor(username, token, email) {
    this.username = username
    this.password = password
    this.email = email

    this.getOptions = {
      headers: {
        Authorization: "token " + token,
        "User-Agent": 'ninjascant/github-api'
      }
    }
    this.postOptions = {
      headers: {
        Authorization: "token " + token,
        'User-Agent': "node-js app"
      },
      method: 'POST',
      body: ''
    }
  }
  apiGetReq(url) {
    return new Promise((resolve, reject) => {
      request(url, this.getOptions,
        (err, response, body) => err?reject(err):resolve(JSON.parse(body)))
    })
  }
  apiPostReq(options) {
    return new Promise((resolve, reject) => {
      request(options,
        (err, response, body) => err?reject(err):resolve(response))
    })
  }
  getRef(owner, repo, branch) {
    const url = `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`
    return this.apiGetReq(url)
  }
  getTree(owner, repo, sha) {
    const url = `https://api.github.com/repos/${owner}/${repo}/git/commits/${sha}`
    return this.apiGetReq(url)
  }
  getBlob(owner, repo, sha) {
    const url = `https://api.github.com/repos/${owner}/${repo}/git/blobs/${sha}`
    return this.apiGetReq(url)
  }
  getBlobSha(owner, repo, branch, filePath) {
    return new Promise((resolve, reject) => {
      getRef(owner, repo, branch)
        .then(ref => {
          return getTree(owner, repo, ref.object.sha)
        }).then(tree => {
          const sha = tree.tree.filter(item => item.path===filePath)[0].sha
          return getBlob(owner, repo, branch, sha)
        }).then(blob => {
          resolve(blob)
        }).catch(error => reject(error))
    })
  }
  createFile(owner, repo, path, message, content, branch) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/index.html`
    this.postOptions.body = {
      message: message,
      committer: {
        name: this.username,
        email: this.email
      },
      content: content
    }
    this.postOptions.uri = url
    return this.apiPostReq(this.postOptions)
  }
}