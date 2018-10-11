const glob = require('glob')
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

// client entry
exports.entryClient = function () {

  const entry = {};
  
  const arr = glob.sync('./src/modules/**/entry-client.js');

  arr.forEach(item => {
    const moduleName = item.split('modules/')[1].split('/')[0];
    entry[moduleName] = item;
  });

  return entry;
}

// server entry
exports.entryServer = function () {

  const entry = {};

  const arr = glob.sync('./src/modules/**/entry-server.js');

  arr.forEach(item => {
    const moduleName = item.split('modules/')[1].split('/')[0];
    entry[moduleName] = item;
  });

  return entry;
}

// HtmlWebpackPlugin instance array
exports.html = function() { 

  const htmlPuginArr = [];

  const arr = glob.sync('./src/modules/**/entry-client.js');

  arr.forEach(item => {

    const moduleName = item.split('modules/')[1].split('/')[0];
    
    const config = {
      filename: `${moduleName}.html`,
      template: path.resolve(__dirname, '../index.template.html'),
      chunks: ['manifest', 'vendor', moduleName],
      inject: true
    };

    htmlPuginArr.push(new HtmlWebpackPlugin(config))
  });

  return htmlPuginArr;
}
