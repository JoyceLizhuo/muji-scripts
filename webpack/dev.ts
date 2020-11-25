import fs from 'fs'
import webpack from 'webpack'
import chalk from 'chalk'
import WebpackDevServer from 'webpack-dev-server'
import getDllConfig from './webpack.config.dll'
import { paths, statsConfig, logStats } from './config'

const HOST = '0.0.0.0'
const PORT = 3000
const dllConfig = getDllConfig()
const options: WebpackDevServer.Configuration = {
  stats: statsConfig,

  // Enable hot reloading server. It will provide /sockjs-node/ endpoint
  // for the WebpackDevServer client so it can learn when the files were
  // updated. The WebpackDevServer client is included as an entry point
  // in the Webpack development configuration. Note that only changes
  // to CSS are currently hot reloaded. JS changes will refresh the browser.
  // hot: false,

  // disable auto inserted HMR socket client
  inline: false,
  // host: 'localhost',

  // Enable gzip compression of generated files.
  compress: true,

  // WebpackDevServer is noisy by default so we emit custom message instead
  // by listening to the compiler events with `compiler.plugin` calls above.
  // quiet: true,
  historyApiFallback: {
    // Paths with dots should still use the history fallback.
    // See https://github.com/facebookincubator/create-react-app/issues/387.
    disableDotRule: true,
  },

  // Silence WebpackDevServer's own logs since they're generally not useful.
  // It will still show compile warnings and errors with this setting.
  clientLogLevel: 'none',
  publicPath: paths.publicPathFordev,
  proxy: {
    '/mock/': {
      target: 'http://localhost:8082',
    },
  },
}

async function startDevServer() {
  console.info('starting dev server')
  const getWebpackConfig = await import('./webpack.config')
  const config = getWebpackConfig.default()
  const compiler = webpack(config)
  const devServer = new WebpackDevServer(compiler, options)
  devServer.listen(PORT, HOST, (err) => {
    if (err) {
      console.error('error happened: ', err)
    } else {
      console.info(
        chalk.blue(`development server listening at http://localhost:${PORT}`),
      )
    }
  })
}

// 没构建过 dll 时先构建 dll，dll 构建完成之后再启动 devServer
if (!fs.existsSync(paths.manifestDevPath)) {
  console.info('building dll...')
  webpack(dllConfig, (err, stats) => {
    if (err) {
      console.error('dll 打包过程中发生错误：', err)
      return
    }
    console.info('building dll finished')
    console.info()
    logStats(stats)
    startDevServer().then(() => console.log('启动完成'))
  })
} else {
  startDevServer().then(() => console.log('启动完成'))
}
