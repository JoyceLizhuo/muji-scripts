/*
 * 用于mock的服务
 */
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const PORT = 8082
const prefix = '/mock'

app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: true }))

const test = require('./test')
app.all(`${prefix}/log`, test())

// 启动mock
app.listen(PORT, '0.0.0.0', () => {
  console.info(`mock server is listening on http://localhost:${PORT}`)
})
