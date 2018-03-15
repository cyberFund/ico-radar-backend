module.exports = {
  apps : [
      {
        name: "chaingear-backend", // this name allows to identify app in pm2
        script: "./server.js", // script used to start app
        watch: true,
        env_production: { // Enviromental variables used in production mode
            "PORT": 8000, 
            "NODE_ENV": "dev", // This variable is used when app decides which Mongo URI should be used: production or test
        }
      }
  ]
}
