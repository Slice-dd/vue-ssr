const merge = require('webpack-merge');

const client = require('./webpack.client.conf');
const server = require('./webpack.server.conf');

const utils = require('./utils');

const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

const webpackConfig = {};

utils.modulesArray().forEach((module) => {
    const clientConfig = merge(client, {
        entry: {
            [module]: utils.entryClient()[module]
        },
        output: {
            filename: `js/${module}/[name].js`
        },
        plugins: [
            new VueSSRClientPlugin({
                filename: `server/${module}/vue-ssr-client-manifest.json`
            })
        ]
    });
    const serverConfig = merge(server, {
        entry: {
            [module]: utils.entryServer()[module]
        },
        plugins: [
            new VueSSRServerPlugin({
                filename: `server/${module}/vue-ssr-server-bundle.json`
            })
        ]
    });

    webpackConfig[module] = { clientConfig: clientConfig, serverConfig: serverConfig };
})

module.exports = webpackConfig

