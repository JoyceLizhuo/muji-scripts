const { paths, libModules, sourceMapForDev } = require('./config')
const webpack = require('webpack')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? 'source-map' : sourceMapForDev,
  entry: {
    'lib': libModules
  },
  output: {
    path: paths.libPath,
    filename: isProd ? '[name].[fullhash].js' : '[name].js',
    library: '[name]',
    publicPath: isProd ? paths.publicPathForProd : paths.publicPathFordev,
  },
  plugins: [
    new webpack.DllPlugin({
      path: isProd ? paths.manifestPath : paths.manifestDevPath,
      name: '[name]',
      context: __dirname
    })
  ],
}
