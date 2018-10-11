const webpackConfig = require('./mutipage');
const webpack = require('webpack');


for (const module in webpackConfig) {
    console.log(webpackConfig[module].clientConfig);
    webpack(webpackConfig[module].clientConfig, ()=>{});
    webpack(webpackConfig[module].serverConfig, ()=>{});
}