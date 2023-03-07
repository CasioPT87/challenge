const express = require('express')
const logger = require('./src/logger')
const app = express()
const port = 8000

app.listen(port, () => {
  logger.info(`Server listening on port: ${port}`)
})

module.exports = app