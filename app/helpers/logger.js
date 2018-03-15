const winston = require('winston')

// Format in which timestamps will be written
const tsFormat = () => (new Date()).toLocaleTimeString()
// Variable that defines directory that contains log files
const logDir = './app/logs'

// Initialize a winston logger instance that logs in console and file in app/logs dir
module.exports = new winston.Logger({
  // Defines transports that will be used to write logs: Console transport and File transport. 
  transports: [
    new winston.transports.Console ({
      timpestamp: tsFormat,
      colorize: true
    }),
    // this transport writes logs to the app/logs/result.log file
    new (winston.transports.File)({
      filename: `${logDir}/results.log`,
      timpestamp: tsFormat
    })
  ]
})
