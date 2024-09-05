const express = require('express')
const { createServer } = require('http')
const { join } = require('path')

//SERVER SETUP
const app = express()
const server = createServer(app)
app.use(express.static("./Web"))
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'Web/index.html'))
})

module.exports = { server }