const { prepareApp } = require('./app')
const express = require('express')
const logger = require('./src/logger')
const appExpress = express()
const port = 8000

const app = prepareApp(appExpress)

app.listen(port, () => {
  logger.info(`Server listening on port: ${port}`)
})

module.exports = app