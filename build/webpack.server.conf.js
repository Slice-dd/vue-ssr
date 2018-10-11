const webpack = require('webpack')
const merge = require('webpack-merge')

const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  target: 'node',
  output: {
    filename: '[name].server-bundle.js',
    libraryTarget: 'commonjs2',
  },    
  plugins: [

  ]
})
