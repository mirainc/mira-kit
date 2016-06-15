var webpack = require('webpack');
var path = require('path');
var WrapperPlugin = require('wrapper-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname);
var SDK_DIR = path.resolve(__dirname, 'sdk');

var config = {
  entry: ['whatwg-fetch', SDK_DIR + '/index.jsx'],
  output: {
    path: BUILD_DIR,
    filename: 'index.js'
  },

  module: {
    loaders: [
      {
        test: /\.(jsx)$/,
        include: SDK_DIR,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
          plugins: ['typecheck', 'syntax-flow', 'transform-class-properties']
        }
      }
    ]
  },

  plugins: [
    new WrapperPlugin({
      header: 'module.exports='
    })
  ]
};

module.exports = config;
