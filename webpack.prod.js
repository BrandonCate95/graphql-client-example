const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionPlugin = require("compression-webpack-plugin")
const safePostCssParser = require('postcss-safe-parser')
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

module.exports = merge(common, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  entry: {
    index: './src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new CompressionPlugin()
  ],
  optimization: {
    concatenateModules: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // set to true if you want JS source maps,
        // only uncomment on final build as only decreases size by 1% to 2% and lose all error handling
        uglifyOptions: {
          mangle: true,
          compress: {
            warnings: false, // Suppress uglification warnings
            pure_getters: true,
            unsafe_comps: true,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true
          },
          output: {
            comments: false,
          },
          exclude: [/\.min\.js$/gi] // skip pre-minified libs
        }
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: shouldUseSourceMap
            ? {
                inline: false,
                annotation: true,
              }
            : false,
        },
      })
    ]
  }
})