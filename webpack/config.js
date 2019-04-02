const path = require('path')

function getAbsolutePath(dir) {
  return path.resolve(__dirname, dir)
}

const paths = {
  indexHtml: getAbsolutePath('../src/index.html'),
  srcPath: getAbsolutePath('../src'),
  nodeModulePath: getAbsolutePath('../node_modules'),
  entry: getAbsolutePath('../src/index.tsx'),
  output: getAbsolutePath('../dist'),
  faviconPath: getAbsolutePath('../public/favicon.ico'),

  // 有静态资源服务的话改成服务的地址，没有的话用 '/'（即你的网站的根 path）
  publicPathFordev: '/',
  publicPathForProd: '/dist/',

  // dll 的配置
  libPath: getAbsolutePath('../dist'),
  manifestPath: getAbsolutePath('../dist/manifest.json'),
  manifestDevPath: getAbsolutePath('../dist/dev/manifest.json'),
}

const statsConfig = {
  // fallback value for stats options when an option is not defined (has precedence over local webpack defaults)
  all: undefined,

  // 输出打包得到的资源
  assets: true,

  // 出了这些资源：
  excludeAssets: /\.(png|jpg|jpeg|woff|svg|cur|eot|gif|ttf)/,

  // Sort assets by a field
  // You can reverse the sort with `!field`.
  assetsSort: 'field',

  // Add build date and time information
  builtAt: true,

  // Add information about cached (not built) modules
  cached: false,

  // Show cached assets (setting this to `false` only shows emitted files)
  cachedAssets: false,

  // Add children information
  children: false,

  // Add chunk information (setting this to `false` allows for a less verbose output)
  chunks: false,

  // Add built modules information to chunk information
  chunkModules: false,

  // Add the origins of chunks and chunk merging info
  chunkOrigins: false,

  // Sort the chunks by a field
  // You can reverse the sort with `!field`. Default is `id`.
  chunksSort: 'field',

  // `webpack --colors` equivalent
  colors: false,

  // Display the distance from the entry point for each module
  depth: false,

  // Display the entry points with the corresponding bundles
  entrypoints: false,

  // Add --env information
  env: false,

  // Add errors
  errors: true,

  // Add details to errors (like resolving log)
  errorDetails: true,

  // Add the hash of the compilation
  hash: false,

  // Set the maximum number of modules to be shown
  maxModules: 15,

  // Add built modules information
  modules: false,

  // Sort the modules by a field
  // You can reverse the sort with `!field`. Default is `id`.
  modulesSort: 'field',

  // Show dependencies and origin of warnings/errors (since webpack 2.5.0)
  moduleTrace: false,

  // Show performance hint when file size exceeds `performance.maxAssetSize`
  performance: false,

  // Show the exports of the modules
  providedExports: false,

  // Add public path information
  publicPath: false,

  // Add information about the reasons why modules are included
  reasons: false,

  // Add the source code of modules
  source: false,

  // Add timing information
  timings: true,

  // Show which exports of a module are used
  usedExports: false,

  // Add webpack version information
  version: false,

  // Add warnings
  warnings: false
}

module.exports = {
  paths,

  // 公共的库，被打包成 dll
  libModules: [
    'lodash-es',
    'react',
    'react-dom',
    'redux',
    'classnames',
    'prop-types',
    'react-redux',
    'redux-actions',
    'react-router-dom',
    'react-router',
    'axios',
    'styled-components'
  ],

  statsConfig,

  sourceMapForDev: 'cheap-module-eval-source-map', // 'cheap-module-eval-source-map'

  logStats(stats) {
    const {
      time,
      builtAt,
      outputPath,
      assets
    } = stats.toJson(statsConfig)
    console.info('time:', time)
    console.info('builtAt:', builtAt)
    console.info('outputPath:', outputPath)
    console.info('assets:')
    assets.forEach(({name, size}) => {
      console.info(`${name}, size: ${size}`)
    })
  },
}
