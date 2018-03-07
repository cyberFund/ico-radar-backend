const winston = require('winston')

const tsFormat = () => (new Date()).toLocaleTimeString()
const logDir = './app/logs'

// Initialize a winston logger instance that logs in console and file in app/logs dir
module.exports = new winston.Logger({
  transports: [
    new winston.transports.Console ({
      timpestamp: tsFormat,
      colorize: true
    }),
    new (winston.transports.File)({
      filename: `${logDir}/results.log`,
      timpestamp: tsFormat
    })
  ]
})
