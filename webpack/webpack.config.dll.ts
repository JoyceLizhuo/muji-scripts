import webpack from 'webpack'
import { paths, libModules, sourceMapForDev } from './config'

export default function getDllConfig(isProd = false): webpack.Configuration {
  return {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : sourceMapForDev,
    entry: {
      lib: libModules,
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
        context: __dirname,
      }),
    ],
  }
}
