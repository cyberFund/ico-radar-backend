module.exports = {
  apps : [
      {
        name: "chaingear-backend",
        script: "./server.js",
        watch: true,
        env_production: {
            "PORT": 8000,
            "NODE_ENV": "dev",
        }
      }
  ]
}
