const config = require('../../config.json')
const prms = require('../helpers/promisified.js')
const Github = require('github-api-node')
const PostGenerator = require('../helpers/post_generator.js')
const logger = require('../helpers/logger.js')

const owner = 'ninjascant', // 'ninjascant'
  path = '/posts/',
  br = 'master'
const github = new Github({
  username: owner,
  password: config.git_key_main,
  auth: "basic"
})
const repo = github.getRepo(owner, 'golos-academy')
const options = {
	author: {name: 'GolosBot', email: 'echo.from@yandex.ru'},
	committer: {name: 'GolosBot', email: 'echo.from@yandex.ru'},
	encode: true
}
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
    const postGen = new PostGenerator(req.body)
    const post = postGen.createPost()
    const title = req.body.project_info.blockchain.project_name.replace(/[\W]/g, '')
    /*golos.broadcast.comment(config.wif, '', 'ico-info', 'golos-chaingear', title, req.body.form.blockchain.project_name, post, {tags: ['ico-info']})
      .then(res => {

      })*/
    writeOrUpdate(repo, br, title, `posts/${title}.md`, post)
      .then(result=>{
        logger.info(`Post created. Project: ${req.body.project_info.blockchain.project_name}; timestamp: ${new Date()}`)
        res.send('Post created!')
        res.status(200)
      })
      .catch(error=>console.log(error))
  })
}
