const { paths, sourceMapForDev } = require('./config')
const createStyledComponentsTransformer = require('typescript-plugin-styled-components')
  .default
const tsImportPluginFactory = require('ts-import-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin')
const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const path = require('path')

module.exports = () => {
  const isProd = process.env.NODE_ENV === 'production'
  const rules = [
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
                  ['postcss-preset-env', { features: {  'nesting-rules': true,}}],
                  ['postcss-apply']
              ]
              // plugins: () => [
              //   // 支持嵌套写法
              //   require('postcss-preset-env')({
              //     features: {
              //       'nesting-rules': true,
              //     },
              //   }),
              //   require('postcss-apply'),
              // ],
            },
            sourceMap: true,
          },
        },
      ],
    },
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.woff$/, /\.svg$/],
      loader: 'url-loader',
      options: isProd
        ? {
            limit: 10,
            name: '[path][name].[ext]',
          }
        : {
            limit: 1000000,
            name: '[path][name].[ext]',
          },
    },
  ]
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
      rules,
    },
    plugins: [
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require(isProd ? paths.manifestPath : paths.manifestDevPath),
      }),
      new HtmlWebpackPlugin({
        template: paths.indexHtml,
        title: isProd ? 'hello' : 'hello',
        favicon: paths.faviconPath,
      }),
      new HtmlWebpackTagsPlugin({
        scripts: [{
          path: isProd ? '' : '../dist',
          glob: isProd ? 'lib.*.js' : 'lib.js',
          globPath: path.join(__dirname, '../dist'),
          globFlatten: isProd,
        }],
        append: false
      }),
      // new AddAssetHtmlPlugin([
      //   {
      //     filepath: isProd
      //       ? paths.libPath + '/lib.*.js'
      //       : paths.libPath + '/lib.js',
      //     includeSourcemap: isProd,
      //   },
      // ]),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: isProd ? 'index.[fullhash].css' : 'index.css',
        chunkFilename: isProd ? '[name].[fullhash].css' : '[name].css',
      }),
      new ForkTsCheckerWebpackPlugin(),
    ],
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
      hints: false,
    },
  }
}
