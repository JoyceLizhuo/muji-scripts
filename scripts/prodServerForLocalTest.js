const { paths } = require('../webpack/config')
const PORT = 3010
const express = require('express')
// const bodyParser = require('body-parser')
// const proxy = require('http-proxy-middleware')
const app = express()
const path = require('path')

// 启动服务测试打包得到的生产代码
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

app.use('/dist', express.static(paths.output))

app.get(
  '*',
  (req, res) => {
    res.sendFile(path.resolve(paths.output, 'index.html'))
  }
)

app.listen(PORT, () => {
  console.info(`prod server is listening on http://localhost:${PORT}`)
})
