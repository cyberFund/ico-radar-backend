const request = require('request')

// Defines methods to interact with Github API. Note that all of this methods are promise-based so you should attach .then handler to get their results
module.exports = class GithubApi {
  constructor(username, token, email, password) {
    // Auth info. Currently all of the methods use Github access token instead of password, but it's planned to add an option to authorize with a plane password
    this.username = username
    this.password = password
    this.email = email

    // Define headers for API requests. Note that Github requires an user-agent to be necessarily defined
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
  // Makes a GET request to Github API with specified URL. Generally, this method is used within other more sprecific methods like getTree. Example: apiGetReq('https://api.github.com/repos/ninjascant/chaingear/git/refs/heads/gh-pages') returns a ref for gh-pages branch
  apiGetReq(url) {
    return new Promise((resolve, reject) => {
      request(url, this.getOptions,
        (err, response, body) => err?reject(err):resolve(JSON.parse(body)))
    })
  }
  // Makes a POST request to Github API. Like a previous one, this method is often used with more specific functions
  apiPostReq(options) {
    return new Promise((resolve, reject) => {
      request(options,
        (err, response, body) => err?reject(err):resolve(response))
    })
  }
  // Fetches ref of a head commit in a specified branch
  getRef(owner, repo, branch) {
    const url = `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`
    return this.apiGetReq(url)
  }
  // Gets tree by sha
  getTree(owner, repo, sha) {
    const url = `https://api.github.com/repos/${owner}/${repo}/git/commits/${sha}`
    return this.apiGetReq(url)
  }
  // Gets blob by sha
  getBlob(owner, repo, sha) {
    const url = `https://api.github.com/repos/${owner}/${repo}/git/blobs/${sha}`
    return this.apiGetReq(url)
  }
  // Composite method that helps to get sha of a specified file in repo.
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
  // Creates a new file in repo
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