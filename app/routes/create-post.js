const config = require('../../config.json')
const Github = require('github-api-node')
const PostGenerator = require('../helpers/post-generator.js')
const logger = require('../helpers/logger.js')

// List of options used to make a commit to Github
const owner = 'ninjascant', // 'ninjascant'
  path = '/posts/',
  br = 'master'

// Initialize Github object used to make API requests
const github = new Github({
  username: owner,
  password: config.git_key_main,
  auth: "basic"
})
// Define repo in which posts will be saved
const repo = github.getRepo(owner, 'golos-academy')
// This options will be used for commit message
const options = {
	author: {name: 'GolosBot', email: 'echo.from@yandex.ru'},
	committer: {name: 'GolosBot', email: 'echo.from@yandex.ru'},
	encode: true
}
// Promise wrapper for repository.write method from the github-api-node lib. Used to make commits to the specified repository. Helps to avoid callback hell
const writeOrUpdate = (repository, branch, link, file, text) => {
  return new Promise((resolve, reject)=> {
  	repository.write(branch,
  	  file,
  		text,
  		`Commit from golosBot. Add: ${link}`,
  		options,
  		err => err?reject(err):resolve(`File ${link}.md created`))
  })
}

// This method defines a route for creation of post for Golos. It converts raw json data into human-readable post by helper createPost method from PostGenerator class and sends it to specified API (in test regime - github api instead of golos)
module.exports = (app) => {
  app.post('/create-post', (req, res) => {
    // Initialize an instance of helper PostGenerator class and call its createPost method to create a human-readable text from raw data
    const postGen = new PostGenerator(req.body)
    const post = postGen.createPost()
    // Removes non-alphanumeric characters from project_name. This string will be used as a post permlink
    const title = req.body.project_info.blockchain.project_name.replace(/[\W]/g, '')
    /*golos.broadcast.comment(config.wif, '', 'ico-info', 'golos-chaingear', title, req.body.form.blockchain.project_name, post, {tags: ['ico-info']})
      .then(res => {

      })*/
    // Mock function that replaces actual call to Golos API and saves post in Github repo
    writeOrUpdate(repo, br, title, `posts/${title}.md`, post)
      .then(result=>{
        logger.info(`Post created. Project: ${req.body.project_info.blockchain.project_name}; timestamp: ${new Date()}`)
        res.send('Post created!')
        res.status(200)
      })
      .catch(error=>console.log(error))
  })
}
