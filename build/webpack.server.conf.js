const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

const baseWebpackConfig = require('./webpack.base.conf')
const config = require('./config')

const utils = require('./utils.js')

module.exports = merge(baseWebpackConfig, {
  entry: utils.entryServer(),
  // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
  target: 'node',
  output: {
    filename: '[name].server-bundle.js',
    libraryTarget: 'commonjs2',
  },
  plugins: [
     new VueSSRServerPlugin()
  ]
})
