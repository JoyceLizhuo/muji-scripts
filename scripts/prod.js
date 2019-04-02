process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

const { paths, logStats } = require('../webpack/config')
const rimraf = require('rimraf')
const webpack = require('webpack')
const dllConfig = require('../webpack/webpack.config.dll')

rimraf(paths.output, () => {
  console.time('build prod finished within')
  console.info(`>>>>>>>>>> ${paths.output} 目录已被清空`)
  console.info('>>>>>>>>>> building dll...')
  webpack(dllConfig, (err, stats) => {
    if (err) {
      console.error('dll 打包过程中发生错误：', err)
      return
    }
    logStats(stats)
    console.info('<<<<<<<<<< building dll finished')
    console.info()
    console.info('>>>>>>>>>> building prod...')
    const webpackConfig = require('../webpack/webpack.config')
    webpack(webpackConfig(), (err, statsProd) => {
      if (err) {
        console.error('打包生产代码过程中发生错误：', err)
        return
      }
      logStats(statsProd)
      console.info('<<<<<<<<<< build finished')
      console.timeEnd('build prod finished within')
    })
  })
})
