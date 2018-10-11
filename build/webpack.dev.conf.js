const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrors = require('friendly-errors-webpack-plugin')


const baseWebpackConfig = require('./webpack.base.conf')
const config = require('./config')

const utils = require('./utils')

const express = require('express')
const history = require('connect-history-api-fallback')

const app = express();

const modules = Object.keys(utils.entryClient()).map(item => {
    return { from: item, to: `./${item}.html` }
});

console.log(modules);

app.use(history({
    rewrites: [...modules, { from: 'test', to: '/oms.html' }],
    verbose: true
}));

module.exports = merge(baseWebpackConfig, {
    entry: utils.entryClient(),
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true,
        proxy: config.proxy
    },
    devtool: '#eval-source-map',
    plugins: [
        // new HtmlWebpackPlugin({
        //   filename: 'index.html',
        //   template: 'index.template.html',
        //   inject: true // 插入css和js
        // }),
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrors()
    ]
})



