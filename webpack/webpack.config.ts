import webpack from 'webpack'
import createStyledComponentsTransformer from 'typescript-plugin-styled-components'
import tsImportPluginFactory from 'ts-import-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackTagsPlugin from 'html-webpack-tags-plugin'
import { paths, sourceMapForDev } from './config'

export default function getWebPackConfig(
  isProd = false,
): webpack.Configuration {
  return {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : sourceMapForDev,
    entry: [paths.entry],
    resolve: {
      extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.css', '.less'],
    },
    output: {
      path: paths.output,
      filename: isProd ? 'index.[fullhash].js' : 'index.js',
      chunkFilename: isProd ? '[name].[fullhash].js' : '[name].js',
      publicPath: isProd ? paths.publicPathForProd : paths.publicPathFordev,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                getCustomTransformers: () => ({
                  before: [
                    // 通过 createStyledComponentsTransformer 的参数配置可以让 debug 更友好
                    createStyledComponentsTransformer(),
                    tsImportPluginFactory({
                      style: 'css',
                    }),
                  ],
                }),
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  // ident: 'postcss',
                  plugins: [
                    [
                      'postcss-preset-env',
                      { features: { 'nesting-rules': true } },
                    ],
                    ['postcss-apply'],
                  ],
                },
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.woff$/, /\.svg$/],
          loader: 'url-loader',
          options: {
            limit: 10,
            name: '[path][name].[ext]',
          },
        },
      ],
    },
    plugins: [
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require(isProd ? paths.manifestPath : paths.manifestDevPath),
      }),
      new HtmlWebpackPlugin({
        template: paths.indexHtml,
        title: 'hello',
        favicon: paths.faviconPath,
      }),
      new HtmlWebpackTagsPlugin({
        scripts: [
          {
            path: isProd ? '' : '../dist',
            glob: isProd ? 'lib.*.js' : 'lib.js',
            globPath: paths.output,
            globFlatten: isProd,
          },
        ],
        append: false,
      }),
      new MiniCssExtractPlugin({
        filename: isProd ? 'index.[fullhash].css' : 'index.css',
        chunkFilename: isProd ? '[name].[fullhash].css' : '[name].css',
      }),
      new ForkTsCheckerWebpackPlugin(),
    ],
  }
}
