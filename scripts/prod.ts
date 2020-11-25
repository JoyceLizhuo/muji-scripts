import webpack from 'webpack'
import rimraf from 'rimraf'
import getDllConfig from '../webpack/webpack.config.dll'
import { paths, logStats } from '../webpack/config'

const dllConfig = getDllConfig(true)

rimraf(paths.output, () => {
  console.time('build prod finished within')
  console.info(`>>>>>>>>>> ${paths.output} 目录已被清空`)
  console.info('>>>>>>>>>> building dll...')
  webpack(dllConfig, async (err, stats) => {
    if (err) {
      console.error('dll 打包过程中发生错误：', err)
      return
    }
    logStats(stats)
    console.info('<<<<<<<<<< building dll finished')
    console.info()
    console.info('>>>>>>>>>> building prod...')
    const getWebpackConfig = await import('../webpack/webpack.config')
    const config = getWebpackConfig.default(true)
    webpack(config, (err, statsProd) => {
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
